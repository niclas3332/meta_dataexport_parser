// components/LogViewer/CategoryList.jsx
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CategoryList = ({ categories, selectedCategory, onCategorySelect }) => (
    <Card className="shadow-sm ">
        <CardHeader>
            <CardTitle>Categories</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 space-y-3">
                {categories.map((category) => (
                    <Card
                        key={category.id}
                        className={`transition-colors cursor-pointer hover:bg-muted ${
                            selectedCategory?.id === category.id ? 'bg-muted border-primary' : ''
                        }`}
                        onClick={() => onCategorySelect(category.id)}
                    >
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-primary">{category.name}</h3>
                            {category.description && (
                                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    </Card>
);

export default CategoryList;