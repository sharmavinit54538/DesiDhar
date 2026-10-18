import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';
import type { Product } from '../types';
import { CategoryStrip } from '../components/home/CategoryStrip';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { DealOfTheDay } from '../components/home/DealOfTheDay';
import { ProductSection } from '../components/home/ProductSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { WhyDesiDhar } from '../components/home/WhyDesiDhar';
import { CustomerReviews } from '../components/home/CustomerReviews';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { Flame, Sparkles, Sun, PackageCheck, Gift } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [deals, setDeals] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [freshToday, setFreshToday] = useState<Product[]>([]);
  const [festiveSweets, setFestiveSweets] = useState<Product[]>([]);
  const [combos, setCombos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchHomeData = async () => {
      try {
        const [d, b, f, s, c] = await Promise.all([
          api.getDealOfTheDay(),
          api.getBestSellers(),
          api.getFreshToday(),
          api.getFestiveSweets(),
          api.getProducts({ category: 'combo-packs' }),
        ]);

        if (mounted) {
          setDeals(d);
          setBestsellers(b);
          setFreshToday(f);
          setFestiveSweets(s);
          setCombos(c.products);
        }
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHomeData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>DesiDhar | Khaalis Desi, Seedha Ghar Tak — Fresh Indian Dairy &amp; Mithai</title>
        <meta
          name="description"
          content="Order farm-fresh A2 Gir Cow Milk, Vedic Bilona Ghee, Safed Makkhan, fresh paneer, matka dahi, and 100% Shuddh Ghee sweets online. Cold-chain doorstep delivery guaranteed before 7 AM."
        />
      </Helmet>

      {/* 1. Category Strip */}
      <CategoryStrip />

      {/* 2. Hero Carousel */}
      <HeroCarousel />

      {/* 3. Deal of the Day with Live Countdown */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 my-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <DealOfTheDay products={deals} />
      )}

      {/* 4. Best Sellers Section */}
      <ProductSection
        title="DesiDhar Bestsellers"
        subtitle="Most loved dairy staples trusted by 50,000+ Indian households"
        icon={<Sparkles className="w-5 h-5 text-amber-500" />}
        badge="Top Rated"
        products={bestsellers}
        viewAllLink="/category/all"
      />

      {/* 5. Fresh Today (Cold-Chain Drop) */}
      <ProductSection
        title="Harvest Fresh Today"
        subtitle="Raw chilled milk, cloud-soft malai paneer, and pot dahi set this morning"
        icon={<Sun className="w-5 h-5 text-emerald-600" />}
        badge="Morning Batch"
        products={freshToday}
        viewAllLink="/category/milk"
        bgWhite
      />

      {/* 6. Visual Category Grid */}
      <CategoryGrid />

      {/* 7. Festive Sweets & Royal Mithai */}
      <ProductSection
        title="Festive Sweets &amp; Royal Mithai"
        subtitle="Handcrafted in 100% Shuddh Desi Ghee. No silver paper adulteration."
        icon={<Gift className="w-5 h-5 text-amber-600" />}
        badge="Pure Ghee Sweets"
        products={festiveSweets}
        viewAllLink="/category/mithai"
      />

      {/* 8. Combos & Bundles */}
      <ProductSection
        title="Daily Breakfast &amp; Kitchen Combos"
        subtitle="Bundle your morning essentials and save up to 25%"
        icon={<PackageCheck className="w-5 h-5 text-amber-600" />}
        badge="Save More"
        products={combos}
        viewAllLink="/category/combo-packs"
        bgWhite
      />

      {/* 9. Why DesiDhar (Purity & Cold-Chain Promise) */}
      <WhyDesiDhar />

      {/* 10. Customer Reviews */}
      <CustomerReviews />
    </>
  );
};
