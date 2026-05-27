import { Link } from 'react-router-dom';
import { Dog, Cat, Bird, Fish, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CategoryData } from '../useHomeLogic';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

interface CategoryQuickLinksProps {
  readonly categories: readonly CategoryData[];
}

const iconMap: Record<string, LucideIcon> = {
  Dog: Dog,
  Cat: Cat,
  Bird: Bird,
  Fish: Fish,
  Heart: Heart,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  dogs: { bg: '#fef3c7', text: '#d97706' },
  cats: { bg: '#ede9fe', text: '#7c3aed' },
  birds: { bg: '#ccfbf1', text: '#0d9488' },
  fish: { bg: '#dbeafe', text: '#2563eb' },
  'small-pets': { bg: '#fce7f3', text: '#db2777' },
};

function CategoryCircle({ category, index }: { readonly category: CategoryData; readonly index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLAnchorElement>({ threshold: 0.1 });
  const IconComponent = iconMap[category.icon];
  const colors = CATEGORY_COLORS[category.slug] || { bg: '#f0f9ff', text: '#2563eb' };

  return (
    <Link
      key={category.slug}
      to={`/browse?category=${category.slug}`}
      ref={ref}
      className="flex flex-col items-center group min-w-[80px] transition-all duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div
        className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
        style={{ backgroundColor: colors.bg }}
      >
        {IconComponent && (
          <IconComponent className="w-8 h-8 md:w-10 md:h-10" style={{ color: colors.text }} />
        )}
      </div>
      <span className="mt-2 text-xs md:text-sm font-medium text-gray-700 text-center">
        {category.name}
      </span>
    </Link>
  );
}

export default function CategoryQuickLinks({ categories }: CategoryQuickLinksProps) {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Comprar por categoría
        </h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {categories.map((category, index) => (
            <CategoryCircle key={category.slug} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
