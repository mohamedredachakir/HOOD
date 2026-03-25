<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $v = Category::create(['name' => 'VOID SERIES', 'description' => 'Seasonal drops. Limited quantities.']);
        $c = Category::create(['name' => 'CORE COLLECTION', 'description' => 'Permanent staples. Essential silhouettes.']);
        $s = Category::create(['name' => 'STATEMENT SERIES', 'description' => 'Heavy graphics and experimental cuts.']);
        $a = Category::create(['name' => 'ARCHIVE', 'description' => 'Past season rereleases. Final units.']);

        // VOID
        Product::create([
            'name' => 'VOID CLASSIC HOODIE',
            'description' => '380gsm premium French Terry. Oversized boxy fit. Charcoal wash.',
            'price' => 850.00,
            'stock_quantity' => 12,
            'category_id' => $v->id,
            'image_path' => 'products/void-classic.png',
        ]);
        Product::create([
            'name' => 'VOID SPLIT-HEM',
            'description' => 'Distressed split-hem hoodie. Heavyweight jersey. Black.',
            'price' => 950.00,
            'stock_quantity' => 8,
            'category_id' => $v->id,
            'image_path' => 'products/void-split.png',
        ]);

        // CORE
        Product::create([
            'name' => 'CORE BLACK HOODIE',
            'description' => 'The ultimate everyday hoodie. 400gsm. Hidden pocket.',
            'price' => 750.00,
            'stock_quantity' => 50,
            'category_id' => $c->id,
            'image_path' => 'products/core-black.png',
        ]);
        Product::create([
            'name' => 'CORE BEIGE HOODIE',
            'description' => 'Minimalist silhouette. Earth tone palette.',
            'price' => 750.00,
            'stock_quantity' => 30,
            'category_id' => $c->id,
            'image_path' => 'products/core-beige.png',
        ]);

        // STATEMENT
        Product::create([
            'name' => 'RIOT GRAFFITI HOODIE',
            'description' => 'Hand-printed graphic series. Each piece is unique.',
            'price' => 1200.00,
            'stock_quantity' => 5,
            'category_id' => $s->id,
            'image_path' => 'products/riot.png',
        ]);

        // ARCHIVE
        Product::create([
            'name' => '2024 DROP ARCHIVE',
            'description' => 'Final rerelease of the original silhouette.',
            'price' => 550.00,
            'stock_quantity' => 3,
            'category_id' => $a->id,
            'image_path' => 'products/archive-1.png',
        ]);
    }
}
