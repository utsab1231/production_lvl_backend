// Generally , two types of handling async function in production level code :

//1. Using try-catch block

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.staus(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

//2. Using promises
const asyncHandler = (fn) => async (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default asyncHandler;

// TODO:i am unware what are the uses of this function till now 2023/december/25 , but will find later.
