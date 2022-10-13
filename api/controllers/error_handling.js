
//PSQL errors
exports.PSQLErrorHandling = (err, req, res, next) => {
    if(err.code === '22P02' || err.code === '23503'){
        res.status(400).send({msg: 'Invalid input type'})
    }else{
        next(err);
    }
};

//custom errors
exports.customErrorHandling = (err, req, res, next) => {
    if(err.status){
        res.status(err.status).send({msg: err.msg});
    }else{
        next(err);
    }
};

//500
exports.internalErrorHandling = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Internal server error'});
};

