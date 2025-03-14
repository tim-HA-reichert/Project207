export default function standardizePropertyNames(req, res, next) {
    if (req.body && typeof req.body === 'object') {

      const standardizedBody = { ...req.body };

      if (standardizedBody.cookingTime !== undefined) {
        standardizedBody.cookingtime = standardizedBody.cookingTime;
        delete standardizedBody.cookingTime;
      }
      
      if (standardizedBody.mealType !== undefined) {
        standardizedBody.mealtype = standardizedBody.mealType;
        delete standardizedBody.mealType;
      }
      
      req.body = standardizedBody;
      
      console.log("Standardized request body:", req.body);
    }
    
    next();
  }
  