import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CategoryListProps } from "@/components/explore/sidebar/types";

export function CategoryList({
  categories,
  selectedCategory,
  expandedCategories,
  setExpandedCategories,
  handleCategoryClick,
}: CategoryListProps) {
  return (
    <Accordion 
      type="multiple" 
      collapsible 
      className="w-full" 
      value={expandedCategories} 
      onValueChange={setExpandedCategories}
    >
      {categories.map((category) => (
        <AccordionItem key={category.slug} value={category.slug} className="border-b">
          <div className="flex items-center">
            <Button
              variant={
                selectedCategory === category.slug ? "secondary" : "ghost"
              }
              className="justify-start text-sm h-10 flex-grow"
              onClick={() => handleCategoryClick(category.slug)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
            
            {category.subcategories.length > 0 && (
              <AccordionTrigger className="h-10 py-0 px-2 flex-none" />
            )}
          </div>
          
          {category.subcategories.length > 0 && (
            <AccordionContent className="space-y-1 pt-1 pb-2">
              {category.subcategories.map((subcategory) => (
                <Button
                  key={subcategory.slug}
                  variant={
                    selectedCategory === subcategory.slug ? "secondary" : "ghost"
                  }
                  className="w-full justify-start text-sm h-9 pl-8 transition-all duration-200 hover:translate-x-1"
                  onClick={() => handleCategoryClick(subcategory.slug)}
                >
                  <span className="mr-2">{subcategory.icon}</span>
                  {subcategory.name}
                </Button>
              ))}
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default CategoryList;