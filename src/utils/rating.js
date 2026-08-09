export function createStars(rating){

let stars = "";

for(let i=1;i<=5;i++){

    if(i<=rating){

        stars += `<i class="bi bi-star-fill text-warning"></i>`;

    }else{

        stars += `<i class="bi bi-star text-warning"></i>`;

    }

}

return stars;

}