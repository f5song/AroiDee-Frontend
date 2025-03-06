import React, { useState, ChangeEvent } from "react";
import {
  Star,
  Heart,
  User,
  Clock,
  ChefHat,
  Printer,
  Share2,
  Bookmark,
  AlertCircle,
  Camera,
  Download,
  Bell,
  Filter,
  MessageCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RefreshCw,
} from "lucide-react";

// Types
interface Nutrition {
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  sugar: string;
}

interface RelatedRecipe {
  title: string;
  image: string;
}

interface Comment {
  user: string;
  text: string;
  date: string;
}

interface RecipeData {
  title: string;
  author: string;
  date: string;
  rating: number;
  comments: number;
  image: string;
  prepTime: string;
  cookTime: string;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  nutrition: Nutrition;
  freshRecipes: RelatedRecipe[];
  commentsList: Comment[];
}

// Props Interfaces
interface RecipeHeaderProps {
  title: string;
  author: string;
  date: string;
  rating: number;
  comments: number;
  image: string;
  liked: boolean;
  saved: boolean;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
  setSaved: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RecipeMetaProps {
  prepTime: string;
  cookTime: string;
  difficulty: string;
}

interface ControlBarProps {
  toggleUnit: () => void;
  selectedUnit: string;
  setShowAllergies: React.Dispatch<React.SetStateAction<boolean>>;
  showAllergies: boolean;
  toggleCookingMode: () => void;
}

interface AllergyInfoProps {
  showAllergies: boolean;
  setShowAllergies: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IngredientsTabProps {
  ingredients: string[];
  checkedIngredients: boolean[];
  handleIngredientClick: (index: number) => void;
  getConvertedIngredient: (ingredient: string) => string;
}

interface InstructionsTabProps {
  instructions: string[];
  toggleCookingMode: () => void;
  setTimerMinutes: (minutes: number) => void;
}

interface CommentsTabProps {
  commentsList: Comment[];
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  handleCommentSubmit: () => void;
}

interface NutritionFactsProps {
  nutrition: Nutrition;
  showNutritionDetails: boolean;
  setShowNutritionDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RelatedRecipesProps {
  recipes: RelatedRecipe[];
}

interface TimerProps {
  timer: number;
  timerActive: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  setTimerMinutes: (minutes: number) => void;
}

interface CookingModeViewProps {
  recipe: RecipeData;
  toggleCookingMode: () => void;
  currentStep: number;
  prevStep: () => void;
  nextStep: () => void;
  checkedIngredients: boolean[];
  handleIngredientClick: (index: number) => void;
  getConvertedIngredient: (ingredient: string) => string;
  timer: number;
  timerActive: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  setTimerMinutes: (minutes: number) => void;
}

// Mock data
const recipe: RecipeData = {
  title: "Strawberry Cream Cheesecake",
  author: "John Doe",
  date: "February 10, 2025",
  rating: 4.5,
  comments: 25,
  image: "/recipe.jpg",
  prepTime: "30 minutes",
  cookTime: "6 hours",
  difficulty: "Medium",
  ingredients: [
    "200g graham crackers",
    "100g melted butter",
    "500g cream cheese",
    "200ml whipping cream",
    "100g sugar",
    "Strawberries for topping",
  ],
  instructions: [
    "Crush the graham crackers and mix with melted butter.",
    "Press into a cake mold and chill for 30 minutes.",
    "Mix cream cheese with sugar until smooth.",
    "Whip the cream until stiff peaks form and fold into cheese mix.",
    "Pour onto crust and refrigerate for 6 hours.",
    "Top with strawberries and serve chilled.",
  ],
  nutrition: {
    calories: "320 kcal",
    protein: "5g",
    fat: "22g",
    carbs: "30g",
    sugar: "24g",
  },
  freshRecipes: [
    { title: "Spinach and Cheese Pasta", image: "/recipe2.jpg" },
    { title: "Perfect Fancy Glazed Donuts", image: "/recipe3.jpg" },
    { title: "Mighty Chewy Brownies", image: "/recipe4.jpg" },
  ],
  commentsList: [
    {
      user: "Johanna Doe",
      text: "Amazing recipe! My family loved it!",
      date: "Feb 5, 2025",
    },
    {
      user: "Qiu Xun",
      text: "Tried this and it was perfect!",
      date: "Feb 6, 2025",
    },
  ],
};

// Component: Recipe Header
const RecipeHeader: React.FC<RecipeHeaderProps> = ({ 
  title, 
  author, 
  date, 
  rating, 
  comments, 
  image, 
  liked, 
  saved, 
  setLiked, 
  setSaved 
}) => (
  <div className="relative rounded-xl overflow-hidden">
    <div className="relative h-[500px]">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Recipe Title & Info */}
      <div className="absolute bottom-0 left-0 p-8 w-full">
        <h1 className="text-5xl font-bold mb-3 text-white">{title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
            <User className="mr-2 text-white" size={16} />
            <span className="text-white">{author}</span>
          </div>
          <div className="flex items-center bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
            <Clock className="mr-2 text-white" size={16} />
            <span className="text-white">{date}</span>
          </div>
          <div className="flex items-center bg-orange-500/90 px-4 py-2 rounded-full">
            <Star className="mr-2 text-white" size={16} fill="white" />
            <span className="text-white font-medium">{rating} ({comments} รีวิว)</span>
          </div>
        </div>
        
        {/* Recipe Meta Info */}
        <div className="grid grid-cols-3 gap-4 max-w-xl">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 flex flex-col items-center text-white">
            <Clock className="mb-1" size={20} />
            <span className="text-xs opacity-80">เวลาเตรียม</span>
            <span className="font-medium">{recipe.prepTime}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 flex flex-col items-center text-white">
            <ChefHat className="mb-1" size={20} />
            <span className="text-xs opacity-80">เวลาทำ</span>
            <span className="font-medium">{recipe.cookTime}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 flex flex-col items-center text-white">
            <Star className="mb-1" size={20} />
            <span className="text-xs opacity-80">ความยาก</span>
            <span className="font-medium">{recipe.difficulty}</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="absolute top-6 right-6 flex space-x-3">
        <button
          onClick={() => setLiked(!liked)}
          className={`p-3 rounded-full backdrop-blur-md transition-all ${
            liked ? "bg-red-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          <Heart size={20} fill={liked ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => setSaved(!saved)}
          className={`p-3 rounded-full backdrop-blur-md transition-all ${
            saved ? "bg-yellow-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
        </button>
        <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  </div>
);

// Component: Control Bar
const ControlBar: React.FC<ControlBarProps> = ({ 
  toggleUnit, 
  selectedUnit, 
  setShowAllergies, 
  showAllergies,
  toggleCookingMode
}) => (
  <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-4 px-6 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 justify-between items-center">
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={toggleUnit}
        className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors"
      >
        <Filter size={16} className="mr-2" />
        {selectedUnit === "metric" ? "เปลี่ยนเป็นอิมพีเรียล" : "เปลี่ยนเป็นเมตริก"}
      </button>
      <button
        onClick={() => setShowAllergies(!showAllergies)}
        className="flex items-center text-sm bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full transition-colors"
      >
        <AlertCircle size={16} className="mr-2" />
        ข้อมูลแพ้อาหาร
      </button>
    </div>
    <div className="flex gap-3 flex-wrap">
      <button className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors">
        <Download size={16} className="mr-2" />
        ดาวน์โหลด
      </button>
      <button className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors">
        <Printer size={16} className="mr-2" />
        พิมพ์
      </button>
      <button 
        onClick={toggleCookingMode}
        className="flex items-center text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
      >
        <ChefHat size={16} className="mr-2" />
        เริ่มทำอาหาร
      </button>
    </div>
  </div>
);

// Component: Allergy Info
const AllergyInfo: React.FC<AllergyInfoProps> = ({ showAllergies, setShowAllergies }) => (
  showAllergies && (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle size={20} className="text-yellow-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-800">ข้อมูลการแพ้อาหาร</h3>
            <p className="text-sm text-yellow-700 mt-1">
              สูตรนี้มีผลิตภัณฑ์จากนม อาจมีส่วนประกอบของไข่ และกลูเตน หากคุณมีอาการแพ้อาหาร โปรดพิจารณาเลือกใช้ส่วนประกอบทดแทน
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAllergies(false)}
          className="text-yellow-500 hover:text-yellow-700 p-2"
        >
          <span className="sr-only">ปิด</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  )
);

// Component: Tabs
const IngredientsTab: React.FC<IngredientsTabProps> = ({ 
  ingredients, 
  checkedIngredients, 
  handleIngredientClick, 
  getConvertedIngredient
}) => (
  <div>
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-2xl font-bold text-gray-800">ส่วนผสม</h2>
      <button className="text-sm text-orange-500 hover:text-orange-600 flex items-center bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg transition-colors">
        <Bell size={16} className="mr-2" />
        แจ้งเตือนส่วนผสมขาด
      </button>
    </div>
    <ul className="space-y-3 mb-6">
      {ingredients.map((item, index) => (
        <li
          key={index}
          className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <input
            type="checkbox"
            checked={checkedIngredients[index]}
            onChange={() => handleIngredientClick(index)}
            className="w-5 h-5 rounded-full cursor-pointer accent-orange-500 mr-4"
          />
          <span
            className={
              checkedIngredients[index]
                ? "line-through text-gray-400"
                : "text-gray-700 font-medium"
            }
          >
            {getConvertedIngredient(item)}
          </span>
        </li>
      ))}
    </ul>
    <div className="p-4 bg-orange-50 rounded-xl">
      <h3 className="flex items-center text-orange-700 font-medium mb-2">
        <Info size={18} className="mr-2" />
        เคล็ดลับ
      </h3>
      <p className="text-sm text-orange-700">
        สำหรับครีมชีสที่นุ่มกว่า ให้วางไว้ที่อุณหภูมิห้องประมาณ 30 นาทีก่อนใช้ เพื่อให้เนื้อเนียนและผสมได้ง่าย
      </p>
    </div>
  </div>
);

const InstructionsTab: React.FC<InstructionsTabProps> = ({ 
  instructions, 
  toggleCookingMode, 
  setTimerMinutes 
}) => (
  <div>
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-2xl font-bold text-gray-800">วิธีทำ</h2>
      <button
        onClick={toggleCookingMode}
        className="text-sm bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-lg flex items-center transition-colors"
      >
        <ChefHat size={16} className="mr-2" />
        เริ่มทำอาหาร
      </button>
    </div>
    <ol className="space-y-8 relative before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-gray-100">
      {instructions.map((step, index) => (
        <li key={index} className="pl-12 relative">
          <div className="absolute top-0 left-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">
            {index + 1}
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-700 mb-3">{step}</p>
            <div className="flex flex-wrap gap-2">
              <button className="text-xs text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors">
                <Camera size={14} className="inline mr-1" />
                ดูภาพตัวอย่าง
              </button>
              <button
                onClick={() =>
                  setTimerMinutes(
                    step.includes("30 minutes")
                      ? 30
                      : step.includes("6 hours")
                      ? 360
                      : 5
                  )
                }
                className="text-xs text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Clock size={14} className="inline mr-1" />
                เริ่มจับเวลา
              </button>
            </div>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

const CommentsTab: React.FC<CommentsTabProps> = ({ 
  commentsList, 
  newComment, 
  setNewComment, 
  handleCommentSubmit 
}) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-5">รีวิวและความคิดเห็น</h2>
    <div className="mb-8 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium mb-3">แชร์ความคิดเห็นของคุณ</h3>
      <textarea
        value={newComment}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
        placeholder="แบ่งปันความคิดเห็นของคุณเกี่ยวกับสูตรนี้..."
        className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 h-24"
      />
      <div className="flex flex-wrap justify-between mt-3">
        <div className="flex space-x-2 items-center">
          <button className="text-gray-500 hover:text-gray-700 p-2 rounded-lg transition-colors">
            <Camera size={20} />
          </button>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={22}
                className="text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors"
              />
            ))}
          </div>
        </div>
        <button
          onClick={handleCommentSubmit}
          className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          โพสต์ความคิดเห็น
        </button>
      </div>
    </div>
    
    <div className="space-y-4">
      {commentsList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็นเกี่ยวกับสูตรนี้
        </div>
      ) : (
        commentsList.map((comment, index) => (
          <div
            key={index}
            className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <User size={18} />
              </div>
              <div className="ml-3">
                <div className="font-medium">{comment.user}</div>
                <div className="text-gray-500 text-xs">{comment.date}</div>
              </div>
              <div className="ml-auto flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className="text-yellow-400"
                    fill={star <= 4 ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700">{comment.text}</p>
            <div className="mt-3 flex space-x-4 text-sm">
              <button className="text-gray-500 hover:text-orange-500 transition-colors">
                ชอบ
              </button>
              <button className="text-gray-500 hover:text-orange-500 transition-colors">
                ตอบกลับ
              </button>
              <button className="text-gray-500 hover:text-orange-500 transition-colors">
                แชร์
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// Component: Nutrition Facts
const NutritionFacts: React.FC<NutritionFactsProps> = ({ nutrition, showNutritionDetails, setShowNutritionDetails }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800">คุณค่าทางโภชนาการ</h2>
      <button
        onClick={() => setShowNutritionDetails(!showNutritionDetails)}
        className="text-orange-500 hover:text-orange-600 text-sm underline"
      >
        {showNutritionDetails ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}
      </button>
    </div>
    
    <div className="space-y-4">
      {Object.entries(nutrition).map(([key, value]) => (
        <div key={key} className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                key === 'calories' ? 'bg-orange-500' :
                key === 'protein' ? 'bg-blue-500' :
                key === 'fat' ? 'bg-yellow-500' :
                key === 'carbs' ? 'bg-green-500' : 'bg-red-400'
              }`}></div>
              <span className="capitalize text-gray-700">{key}</span>
            </div>
            <span className="font-medium">{value}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                key === 'calories' ? 'bg-orange-500' :
                key === 'protein' ? 'bg-blue-500' :
                key === 'fat' ? 'bg-yellow-500' :
                key === 'carbs' ? 'bg-green-500' : 'bg-red-400'
              }`}
              style={{ 
                width: key === 'calories' ? '75%' :
                       key === 'protein' ? '25%' :
                       key === 'fat' ? '65%' :
                       key === 'carbs' ? '50%' : '80%'
              }}
            ></div>
          </div>
        </div>
      ))}

      {showNutritionDetails && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <h3 className="font-medium mb-3 text-gray-800">รายละเอียดเพิ่มเติม</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">คอเลสเตอรอล</span>
              <span>45mg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">โซเดียม</span>
              <span>250mg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">แคลเซียม</span>
              <span>15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เหล็ก</span>
              <span>4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">วิตามิน C</span>
              <span>10%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">วิตามิน D</span>
              <span>8%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

// Component: Cooking Tools
const CookingTools: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
    <h2 className="text-xl font-bold text-gray-800 mb-4">อุปกรณ์ที่ต้องใช้</h2>
    <ul className="space-y-3">
      <li className="flex items-center p-2 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
        <span>พิมพ์เค้กกลม ขนาด 8 นิ้ว</span>
      </li>
      <li className="flex items-center p-2 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
        <span>เครื่องผสมอาหาร</span>
      </li>
      <li className="flex items-center p-2 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
        <span>ชามผสม</span>
      </li>
      <li className="flex items-center p-2 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
        <span>ไม้พาย</span>
      </li>
      <li className="flex items-center p-2 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
        <span>ตู้เย็น</span>
      </li>
    </ul>
  </div>
);

// Component: Related Recipes
const RelatedRecipes: React.FC<RelatedRecipesProps> = ({ recipes }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
    <h2 className="text-xl font-bold text-gray-800 mb-4">คุณอาจจะชอบ</h2>
    <div className="space-y-4">
      {recipes.map((item, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-20 h-20 object-cover rounded-lg group-hover:shadow-md transition-all"
          />
          <div>
            <h3 className="font-medium group-hover:text-orange-500 transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>20 นาที</span>
              <span className="mx-2">•</span>
              <Star size={14} className="mr-1 text-yellow-400" fill="currentColor" />
              <span>4.7</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Component: Timer
const Timer: React.FC<TimerProps> = ({ timer, timerActive, toggleTimer, resetTimer, setTimerMinutes }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-lg text-gray-800 mb-4">จับเวลา</h3>
      <div className="flex justify-center text-4xl font-bold mb-5 text-gray-800">
        {formatTime(timer)}
      </div>
      <div className="flex justify-center space-x-3 mb-5">
        <button
          onClick={toggleTimer}
          className={`px-5 py-2 rounded-lg flex items-center ${
            timerActive 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-green-500 hover:bg-green-600 text-white"
          } transition-colors`}
        >
          {timerActive ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
          {timerActive ? "หยุด" : "เริ่ม"}
        </button>
        <button
          onClick={resetTimer}
          className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center transition-colors"
        >
          <RefreshCw size={18} className="mr-2" />
          รีเซ็ต
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        <button
          onClick={() => setTimerMinutes(1)}
          className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          1m
        </button>
        <button
          onClick={() => setTimerMinutes(5)}
          className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          5m
        </button>
        <button
          onClick={() => setTimerMinutes(10)}
          className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          10m
        </button>
        <button
          onClick={() => setTimerMinutes(15)}
          className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          15m
        </button>
        <button
          onClick={() => setTimerMinutes(30)}
          className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          30m
        </button>
      </div>
    </div>
  );
};

// Component: Cooking Mode View
const CookingModeView: React.FC<CookingModeViewProps> = ({ 
  recipe, 
  toggleCookingMode, 
  currentStep, 
  prevStep, 
  nextStep, 
  checkedIngredients, 
  handleIngredientClick, 
  getConvertedIngredient, 
  timer, 
  timerActive, 
  toggleTimer, 
  resetTimer, 
  setTimerMinutes 
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
        <ChefHat className="mr-3 text-orange-500" size={28} />
        โหมดทำอาหาร: {recipe.title}
      </h1>
      <button
        onClick={toggleCookingMode}
        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
      >
        ออกจากโหมดทำอาหาร
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left: Ingredients & Timer */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-gray-50 p-5 rounded-xl">
          <h3 className="font-bold text-xl mb-4 text-gray-800">ส่วนผสม</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((item, index) => (
              <li
                key={index}
                className="flex items-center p-3 hover:bg-white rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checkedIngredients[index]}
                  onChange={() => handleIngredientClick(index)}
                  className="w-5 h-5 rounded-full mr-3 accent-orange-500"
                />
                <span
                  className={
                    checkedIngredients[index]
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }
                >
                  {getConvertedIngredient(item)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Timer Component */}
        <Timer 
          timer={timer}
          timerActive={timerActive}
          toggleTimer={toggleTimer}
          resetTimer={resetTimer}
          setTimerMinutes={setTimerMinutes}
        />
      </div>

      {/* Right: Current Step */}
      <div className="md:col-span-2">
        {/* Step Navigation */}
        <div className="mb-5 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg flex items-center ${
              currentStep === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-orange-100 text-orange-600 hover:bg-orange-200"
            } transition-colors`}
          >
            <ArrowLeft size={18} className="mr-2" />
            ขั้นตอนก่อนหน้า
          </button>
          <span className="font-medium text-gray-600">
            ขั้นตอนที่ {currentStep + 1} จาก {recipe.instructions.length}
          </span>
          <button
            onClick={nextStep}
            disabled={currentStep === recipe.instructions.length - 1}
            className={`px-4 py-2 rounded-lg flex items-center ${
              currentStep === recipe.instructions.length - 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-orange-100 text-orange-600 hover:bg-orange-200"
            } transition-colors`}
          >
            ขั้นตอนถัดไป
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>

        {/* Current Step */}
        <div className="bg-orange-50 p-8 rounded-xl">
          <div className="mb-5 flex items-center">
            <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
              {currentStep + 1}
            </div>
            <div className="ml-4">
              <span className="text-sm text-orange-700 font-medium px-3 py-1 bg-orange-100 rounded-full">
                {currentStep === 0
                  ? "เริ่มต้น"
                  : currentStep === recipe.instructions.length - 1
                  ? "ขั้นตอนสุดท้าย"
                  : `ขั้นตอนที่ ${currentStep + 1}`}
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            {recipe.instructions[currentStep]}
          </h2>

          <div className="mt-8 flex flex-wrap gap-3">
            <button 
              onClick={() => setTimerMinutes(5)}
              className="px-4 py-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg flex items-center transition-colors"
            >
              <Clock size={18} className="mr-2" />
              จับเวลาขั้นตอนนี้
            </button>
            <button className="px-4 py-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg flex items-center transition-colors">
              <Camera size={18} className="mr-2" />
              ดูภาพตัวอย่าง
            </button>
          </div>
        </div>
        
        {/* Step Progress Bar */}
        <div className="mt-6 bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-orange-500 h-full rounded-full"
            style={{ width: `${((currentStep + 1) / recipe.instructions.length) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 text-right text-sm text-gray-500">
          ความคืบหน้า {Math.round(((currentStep + 1) / recipe.instructions.length) * 100)}%
        </div>
      </div>
    </div>
  </div>
);

// Main Component
export default function RecipePage(): JSX.Element {
  // States
  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
    Array(recipe.ingredients.length).fill(false)
  );
  const [newComment, setNewComment] = useState<string>("");
  const [commentsList, setCommentsList] = useState<Comment[]>(recipe.commentsList);
  const [activeTab, setActiveTab] = useState<string>("ingredients");
  const [cookingMode, setCookingMode] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [showNutritionDetails, setShowNutritionDetails] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showAllergies, setShowAllergies] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("metric"); // metric or imperial

  // Handlers
  const handleIngredientClick = (index: number): void => {
    setCheckedIngredients((prev: boolean[]) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleCommentSubmit = (): void => {
    if (newComment.trim()) {
      setCommentsList((prev: Comment[]) => [
        ...prev,
        {
          user: "Current User",
          text: newComment,
          date: new Date().toLocaleDateString(),
        },
      ]);
      setNewComment("");
    }
  };

  const toggleTimer = (): void => {
    setTimerActive(!timerActive);
  };

  const resetTimer = (): void => {
    setTimer(0);
    setTimerActive(false);
  };

  const setTimerMinutes = (minutes: number): void => {
    setTimer(minutes * 60);
    setTimerActive(true);
  };

  const toggleCookingMode = (): void => {
    setCookingMode(!cookingMode);
    // Reset to first step when entering cooking mode
    if (!cookingMode) {
      setCurrentStep(0);
    }
  };

  const nextStep = (): void => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleUnit = (): void => {
    setSelectedUnit(selectedUnit === "metric" ? "imperial" : "metric");
  };

  // Helper functions
  const getConvertedIngredient = (ingredient: string): string => {
    if (selectedUnit === "imperial") {
      // Simple conversion examples
      if (ingredient.includes("g graham crackers")) {
        return ingredient.replace("200g graham crackers", "7oz graham crackers");
      } else if (ingredient.includes("g melted butter")) {
        return ingredient.replace("100g melted butter", "3.5oz melted butter");
      } else if (ingredient.includes("g cream cheese")) {
        return ingredient.replace("500g cream cheese", "17.6oz cream cheese");
      } else if (ingredient.includes("ml whipping cream")) {
        return ingredient.replace("200ml whipping cream", "6.8 fl oz whipping cream");
      } else if (ingredient.includes("g sugar")) {
        return ingredient.replace("100g sugar", "3.5oz sugar");
      }
    }
    return ingredient;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {cookingMode ? (
          // Cooking Mode View
          <CookingModeView 
            recipe={recipe}
            toggleCookingMode={toggleCookingMode}
            currentStep={currentStep}
            prevStep={prevStep}
            nextStep={nextStep}
            checkedIngredients={checkedIngredients}
            handleIngredientClick={handleIngredientClick}
            getConvertedIngredient={getConvertedIngredient}
            timer={timer}
            timerActive={timerActive}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
            setTimerMinutes={setTimerMinutes}
          />
        ) : (
          // Normal Recipe View
          <>
            {/* Hero Section */}
            <RecipeHeader 
              title={recipe.title}
              author={recipe.author}
              date={recipe.date}
              rating={recipe.rating}
              comments={recipe.comments}
              image={recipe.image}
              liked={liked}
              saved={saved}
              setLiked={setLiked}
              setSaved={setSaved}
            />

            {/* Control Bar */}
            <ControlBar 
              toggleUnit={toggleUnit}
              selectedUnit={selectedUnit}
              setShowAllergies={setShowAllergies}
              showAllergies={showAllergies}
              toggleCookingMode={toggleCookingMode}
            />

            {/* Allergy Information */}
            <AllergyInfo 
              showAllergies={showAllergies}
              setShowAllergies={setShowAllergies}
            />

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - Main Content */}
              <div className="flex-grow order-2 lg:order-1">
                {/* Tabs Container */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                  <div className="flex border-b">
                    <button
                      onClick={() => setActiveTab("ingredients")}
                      className={`flex-1 py-4 px-4 font-medium text-center transition-all ${
                        activeTab === "ingredients"
                          ? "text-orange-500 border-b-2 border-orange-500 bg-orange-50"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      ส่วนผสม
                    </button>
                    <button
                      onClick={() => setActiveTab("instructions")}
                      className={`flex-1 py-4 px-4 font-medium text-center transition-all ${
                        activeTab === "instructions"
                          ? "text-orange-500 border-b-2 border-orange-500 bg-orange-50"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      วิธีทำ
                    </button>
                    <button
                      onClick={() => setActiveTab("comments")}
                      className={`flex-1 py-4 px-4 font-medium text-center transition-all ${
                        activeTab === "comments"
                          ? "text-orange-500 border-b-2 border-orange-500 bg-orange-50"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <MessageCircle size={16} className="inline mr-1" />
                      รีวิว ({commentsList.length})
                    </button>
                  </div>

                  <div className="p-6">
                    {activeTab === "ingredients" && (
                      <IngredientsTab 
                        ingredients={recipe.ingredients}
                        checkedIngredients={checkedIngredients}
                        handleIngredientClick={handleIngredientClick}
                        getConvertedIngredient={getConvertedIngredient}
                      />
                    )}

                    {activeTab === "instructions" && (
                      <InstructionsTab 
                        instructions={recipe.instructions}
                        toggleCookingMode={toggleCookingMode}
                        setTimerMinutes={setTimerMinutes}
                      />
                    )}

                    {activeTab === "comments" && (
                      <CommentsTab 
                        commentsList={commentsList}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        handleCommentSubmit={handleCommentSubmit}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="w-full lg:w-96 flex-shrink-0 order-1 lg:order-2">
                <div className="lg:sticky lg:top-20 space-y-6">
                  {/* Nutrition Facts */}
                  <NutritionFacts 
                    nutrition={recipe.nutrition}
                    showNutritionDetails={showNutritionDetails}
                    setShowNutritionDetails={setShowNutritionDetails}
                  />

                  {/* Cooking Tools */}
                  <CookingTools />

                  {/* Related Recipes */}
                  <RelatedRecipes recipes={recipe.freshRecipes} />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}