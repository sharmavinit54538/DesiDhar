import React, { useCallback, useEffect, useState } from 'react';
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
import { ErrorState } from '../components/common/ErrorState';
import { Flame, Sparkles, Sun, PackageCheck, Gift } from 'lucide-react';

interface HomeData {
  deals: Product[];
  dealEndsAt: string | null;
  featured: Product[];
  fresh: Product[];
  sweets: Product[];
  combos: Product[];
}

export const HomePage: React.FC = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHome = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [deals, featured, fresh, sweets, combos] = await Promise.all([
        api.getDeals(),
        api.getFeatured(),
        api.getFreshToday(),
        api.getFestiveSweets(),
        api.getProducts({ category: 'combo-packs', pageSize: 8 }),
      ]);

      setData({
        deals: deals.products,
        dealEndsAt: deals.endsAt,
        featured,
        fresh,
        sweets,
        combos: combos.products,
      });
    } catch (err) {
      setData(null);
      setError(
        err instanceof Error
          ? err.message
          : 'The DesiDhar storefront could not be loaded. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHome();
  }, [loadHome]);

  return (
    <>
      <Helmet>
        <title>DesiDhar | Khaalis Desi, Seedha Ghar Tak — Fresh Indian Dairy &amp; Mithai</title>
        <meta
          name="description"
          content="Order DesiDhar milk, ghee, makkhan, paneer, dahi, cream and mithai online. Live prices, stock and delivery slots."
        />
      </Helmet>

      <CategoryStrip />
      <HeroCarousel />

      {loading && (
        <div className="max-w-7xl mx-auto px-4 my-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="max-w-3xl mx-auto px-4 my-10">
          <ErrorState
            title="The catalogue is unavailable"
            message={error}
            onRetry={() => void loadHome()}
          />
        </div>
      )}

      {!loading && !error && data && (
        <>
          <DealOfTheDay products={data.deals} endsAt={data.dealEndsAt} />

          <ProductSection
            title="Featured by DesiDhar"
            subtitle="Products our kitchen has flagged as featured right now"
            icon={<Sparkles className="w-5 h-5 text-amber-500" />}
            badge="Featured"
            products={data.featured}
            viewAllLink="/category/all"
          />

          <ProductSection
            title="Fresh Today"
            subtitle="Dairy prepared for today's delivery slots"
            icon={<Sun className="w-5 h-5 text-emerald-600" />}
            badge="Morning Batch"
            products={data.fresh}
            viewAllLink="/category/milk"
            bgWhite
          />

          <CategoryGrid />

          <ProductSection
            title="Festive Sweets &amp; Royal Mithai"
            subtitle="Ghee sweets and gift boxes from the live mithai counter"
            icon={<Gift className="w-5 h-5 text-amber-600" />}
            badge="Mithai"
            products={data.sweets}
            viewAllLink="/category/mithai"
          />

          <ProductSection
            title="Daily Breakfast &amp; Kitchen Combos"
            subtitle="Bundles assembled from the current catalogue"
            icon={<PackageCheck className="w-5 h-5 text-amber-600" />}
            badge="Combos"
            products={data.combos}
            viewAllLink="/category/combo-packs"
            bgWhite
          />

          {data.deals.length === 0 && (
            <p className="text-center text-xs text-stone-500 -mt-4 mb-8">
              <Flame className="w-3.5 h-3.5 inline mr-1" />
              No promotion is running right now.
            </p>
          )}

          <WhyDesiDhar />
          <CustomerReviews />
        </>
      )}
    </>
  );
};
