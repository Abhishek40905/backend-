
const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{Promise.resolve(requestHandler(req,res,next)).catch((Error)=>next(Error))}   
    
}
export {asyncHandler}

/*
the above is the async handler function it takes input asyncronous function as an argument(request handler)
then creates a promise when the promise is resolved it runs the requesthandler function and if the prmise is rejected the controll is given to next middleware with an error as an argument
basically this asynchandler function acts as a wrapper function for controller functions
*/