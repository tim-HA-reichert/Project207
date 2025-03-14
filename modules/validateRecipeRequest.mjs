export const validateRecipeRequest = (req, res, next) => {
    const { title, ingredients, instructions } = req.body;
    
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({
        success: false,
        message: 'Missing required recipe fields: title, ingredients, and instructions are required'
      });
    }
    
    next();
  };