export default class Likes{
    constructor(){
        this.likes =[];
    }

    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        };
        this.likes.push(like);

        // Persist the data in local Storage 
        this.persistData() ;
        return like;      
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        // Persist the data in local Storage 
        this.persistData();
        if(localStorage.getItem("likes").length===2){
            // as it is a string and on empty array will be []
            localStorage.removeItem("likes");
        }
    }

    isLiked(id) {
        const index = this.likes.findIndex(el => el.id === id);
        return index !==-1 ;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem("likes", JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem("likes"));
        if(storage){
            // Restore the likes from Storage
            this.likes = storage;
        }
    }
}