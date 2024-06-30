/*
the below function extends the error class in javascript and this class throws custon errors on the basis of input given this class can be instantiated to give custon errors
*/

class ApiError extends Error{
    constructor(statusCode,messege="something went wrong",errors=[],statck=""){
        super(messege)
        this.statusCode=statusCode
        this.data=null
        this.success=false;
        this.errors=errors
        if(stack){
            this.statck=statck
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export{ApiError}