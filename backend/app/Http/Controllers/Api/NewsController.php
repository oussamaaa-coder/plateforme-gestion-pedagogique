<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class NewsController extends Controller
{
    /**
     * Public endpoint – returns only published news for the public website.
     */
    public function public(Request $request)
    {
        $query = News::query()
            ->with('auteur')
            ->where('statut', 'publiee');

        if ($search = $request->query('search')) {
            $query->where('titre', 'like', "%{$search}%");
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $result = $query->orderByDesc('date_publication')->orderByDesc('id')->paginate($perPage);

        return ApiResponse::ok($result, 'Actualités publiques chargées.');
    }

    /**
     * Public endpoint – returns a single published news article and increments views.
     */
    public function publicShow(News $news)
    {
        if ($news->statut !== 'publiee') {
            return ApiResponse::ok(null, 'Actualité non trouvée.', [], 404);
        }

        $news->increment('vues');

        return ApiResponse::ok($news->load('auteur'), 'Détails chargés.');
    }

    public function index(Request $request)
    {
        $query = News::query()->with('auteur');

        if ($search = $request->query('search')) {
            $query->where('titre', 'like', "%{$search}%");
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->query('statut'));
        }

        if ($request->filled('auteur_id')) {
            $query->where('auteur_id', $request->query('auteur_id'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('date_publication', '>=', $request->query('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('date_publication', '<=', $request->query('date_to'));
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $result = $query->orderByDesc('date_publication')->orderByDesc('id')->paginate($perPage);

        return ApiResponse::ok($result, 'Liste chargée.', [
            'filters' => [
                'search' => $search ?? null,
                'date_from' => $request->query('date_from'),
                'date_to' => $request->query('date_to'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => ['required', 'string', 'max:150'],
            'contenu' => ['required', 'string'],
            'resume' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'auteur_id' => ['nullable', 'integer', 'exists:users,id'],
            'statut' => ['nullable', 'string', 'in:brouillon,publiee,archivee'],
            'date_publication' => ['nullable', 'date'],
        ]);

        // Auto-set auteur_id from authenticated user
        if (!isset($data['auteur_id']) || empty($data['auteur_id'])) {
            $data['auteur_id'] = auth()->id();
        }

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('news', 'public');
        }

        $news = News::query()->create($data);

        return ApiResponse::ok($news->load('auteur'), 'News créée.', [
            'changed' => array_keys($data),
        ], 201);
    }

    public function show(News $news)
    {
        return ApiResponse::ok($news->load('auteur'), 'Détails chargés.');
    }

    public function update(Request $request, News $news)
    {
        $data = $request->validate([
            'titre' => ['sometimes', 'required', 'string', 'max:150'],
            'contenu' => ['sometimes', 'required', 'string'],
            'resume' => ['sometimes', 'nullable', 'string', 'max:500'],
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'auteur_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'statut' => ['sometimes', 'nullable', 'string', 'in:brouillon,publiee,archivee'],
            'date_publication' => ['sometimes', 'nullable', 'date'],
        ]);

        // Auto-set auteur_id from authenticated user
        if (!isset($data['auteur_id']) || empty($data['auteur_id'])) {
            $data['auteur_id'] = auth()->id();
        }

        if ($request->hasFile('image')) {
            if ($news->image) {
                Storage::disk('public')->delete($news->image);
            }
            $data['image'] = $request->file('image')->store('news', 'public');
        }

        $news->fill($data)->save();

        return ApiResponse::ok($news->fresh()->load('auteur'), 'News mise à jour.', [
            'changed' => array_keys($data),
        ]);
    }

    public function destroy(News $news)
    {
        $id = $news->id;
        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }
        $news->delete();

        return ApiResponse::ok(['id' => $id], 'News supprimée.', [
            'changed' => ['deleted'],
        ]);
    }

    /**
     * Generate or enhance news text using Groq AI.
     */
    public function aiGenerate(Request $request)
    {
        $request->validate([
            'type' => ['required', 'string', 'in:enhance_resume,generate_content'],
            'titre' => ['nullable', 'string', 'max:150'],
            'resume' => ['nullable', 'string', 'max:1000'],
            'contenu' => ['nullable', 'string'],
        ]);

        $type = $request->input('type');
        $titre = $request->input('titre', '');
        $resume = $request->input('resume', '');
        $contenu = $request->input('contenu', '');

        $apiKey = env('GROQ_API_KEY');

        if (!$apiKey) {
            return ApiResponse::ok(null, 'Clé API Groq non configurée dans le fichier .env.', [], 500);
        }

        $prompt = '';
        if ($type === 'enhance_resume') {
            if (empty($resume)) {
                return ApiResponse::ok(null, 'Veuillez saisir un texte dans le résumé pour pouvoir l\'améliorer.', [], 400);
            }
            $prompt = "Améliore et enrichis le résumé court suivant pour une actualité. Rends-le plus professionnel, fluide et captivant, tout en veillant strictement à ce que la réponse ne dépasse pas 500 caractères. Ne renvoie QUE le texte amélioré, sans phrase d'introduction (ex: 'Voici le résumé amélioré...'), sans métadonnées et sans guillemets.\n\nRésumé à améliorer :\n" . $resume;
        } else {
            if (empty($titre)) {
                return ApiResponse::ok(null, 'Veuillez saisir un titre au moins pour générer le contenu.', [], 400);
            }
            $prompt = "Rédige le corps complet d'un article d'actualité en français d'environ 500 caractères (soit environ 2 ou 3 paragraphes courts et denses). Base-toi sur les informations suivantes :\nTitre : " . $titre . "\nRésumé : " . ($resume ?: 'Non fourni') . "\n\nSois très professionnel, percutant et adapté à une actualité d'établissement de formation professionnelle. Ne répète pas le titre ou le résumé. Ne renvoie QUE le corps de l'article rédigé, sans phrase d'introduction (ex: 'Voici le contenu de l'article...'), sans métadonnées et sans guillemets.";
        }

        try {
            // Using llama-3.3-70b-versatile as primary, fallback to mixtral-8x7b-32768
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.3-70b-versatile',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Tu es un rédacteur professionnel d\'actualités de formation professionnelle. Tu réponds uniquement en français de manière directe et concise. Ne commence jamais tes réponses par des formules d\'introduction.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.7,
                'max_tokens' => 1000,
            ]);

            if ($response->failed()) {
                // Try fallback model
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                ])->timeout(30)->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'mixtral-8x7b-32768',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'Tu es un rédacteur professionnel d\'actualités de formation professionnelle. Tu réponds uniquement en français de manière directe et concise.'
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt
                        ]
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 1000,
                ]);
            }

            if ($response->failed()) {
                $errorMsg = $response->json('error.message') ?: 'Erreur de communication avec Groq AI.';
                return ApiResponse::ok(null, 'Erreur de l\'API AI: ' . $errorMsg, [], 500);
            }

            $generatedText = trim($response->json('choices.0.message.content') ?: '');
            
            // Clean up any potential starting/ending quotes the model might have returned
            $generatedText = preg_replace('/^["\'«\s]+|["\'»\s]+$/u', '', $generatedText);

            return ApiResponse::ok([
                'text' => $generatedText
            ], 'Texte généré avec succès par l\'IA.');

        } catch (\Exception $e) {
            return ApiResponse::ok(null, 'Une exception est survenue : ' . $e->getMessage(), [], 500);
        }
    }
}

