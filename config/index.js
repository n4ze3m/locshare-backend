module.exports = {
    MONGO:
        process.env.NODE_ENV === "production"
            ? "mongodb+srv://buckdb:seabuck2020@cluster0.v9999.mongodb.net/locsnap?retryWrites=true&w=majority"
            : "mongodb://localhost:27017/locsnaps",
};
