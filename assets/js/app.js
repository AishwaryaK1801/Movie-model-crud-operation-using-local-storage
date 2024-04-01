const cl = console.log;

const showModel = document.getElementById("showModel");
const backDrop = document.getElementById("backDrop");
const movieModel = document.getElementById("movieModel");

const closeModelBtns = [...document.querySelectorAll(".closeModel")];

const movieForm = document.getElementById("movieForm");

const titleControl = document.getElementById("title");
const imgUrlControl = document.getElementById("imgUrl");
const overviewControl = document.getElementById("overview");
const ratingControl = document.getElementById("rating");

const movieContainer = document.getElementById("movieContainer");

const addMovie =document.getElementById("addMovie");
const updateMovie=document.getElementById("updateMovie");

let movieArr = [];

const uuid = () => {
  return (
      String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
  ).replace(/[xy]/g, (character) => {
      const random = (Math.random() * 16) | 0;
      const value = character === "x" ? random : (random & 0x3) | 0x8;

      return value.toString(16);
  });
};

const onMovieEdit = (ele) => {
  let editId = ele.closest(".movieCard").id;
  cl(editId);
  localStorage.setItem("editId",editId
  )
  modelBackDropShowHide();
  addMovie.classList.add("d-none");
  updateMovie.classList.remove("d-none");
  let findObj = movieArr.find(obj=>obj.movieId===editId)
  titleControl.value = findObj.title;
  imgUrlControl.value=findObj.imgUrl;
  overviewControl.value=findObj.overview;
  ratingControl.value=findObj.rating;   
}

const onMovieDelete = (ele)=>{

  Swal.fire({
    title: "Do you want to remove this movie?",
    
    showCancelButton: true,
    confirmButtonText: "yes",
    
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {  
      let deleteId = ele.closest(".movieCard").id;
      cl(deleteId);
      let deleteIndex = movieArr.findIndex(obj => obj.movieId===deleteId );
      cl(deleteIndex);
      movieArr.splice(deleteIndex,1);
      cl(movieArr)
      localStorage.setItem("movieArr", JSON.stringify(movieArr));
      ele.closest(".col-md-4").remove();

      Swal.fire("Movie removed succesfully" , "" , "success")
    }
  });

}
const addMovieCard = (obj) =>{
  let card = document.createElement("div");
  card.id = obj.movieId;
  card.className = "col-md-4";
  card.innerHTML=`
  <div class="card mb-4">
        <figure class="movieCard mb-0" id="${obj.movieId}">
          <img src="${obj.imgUrl}" alt="${obj.title}" title="${obj.title}"/>
        <figcaption>
        <div class="ratingSection">
            <div class="row">
                <div class="col-10">
                    <h3>${obj.title}</h3>
                </div>
                <div class="col-2 align-self-center">
        

          <div class="rating text-center ">    
          ${obj.rating >= 4 ? `<p class="bg-success">${obj.rating}</p>` :
            obj.rating < 4 && obj.rating >= 3 ?`<p class="bg-warning">${obj.rating}</p>`: 
            obj.rating < 3 ?`<p class="bg-danger">${obj.rating}</p>`:`<p class="bg-warning">${obj.rating}</p>`}
          </div>

          </div>
      </div>
      </div>
      <div class="overviewSection">
      <h4>${obj.title}</h4>
      <em>Overview</em>
      <p>
      ${obj.overview}
      </p>
      <div class="action">
          <button class="btn btn-outline-info" onClick="onMovieEdit(this)">Edit</button>
          <button class="btn btn-outline-danger onClick="onMovieDelete(this)">Delete</button>
      </div>
      </div>
  </figcaption>
</figure>
</div>  
  `;

  movieContainer.prepend(card);
}

const templatingOfMovies = (arr) => {
  let result = ``;
  arr.forEach((obj) => {
    result += `
		<div class="col-md-4">
			<div class="card mb-4">
	  			<figure class="movieCard mb-0" id="${obj.movieId}">
					<img src="${obj.imgUrl}"
		    		 alt="${obj.title}" title="${obj.title}"
					/>
					<figcaption>
		  				<div class="ratingSection">
							<div class="row">
			 					 <div class="col-10">
									<h3>${obj.title}</h3>
			  					</div>
							    <div class="col-2 align-self-center">
								

                  <div class="rating text-center">    
                  ${obj.rating >= 4 ? `<p class="bg-success">${obj.rating}</p>` :
                    obj.rating < 4 && obj.rating >= 3 ?`<p class="bg-warning">${obj.rating}</p>`: 
                    obj.rating < 3 ?`<p class="bg-danger">${obj.rating}</p>`:`<p class="bg-warning">${obj.rating}</p>`}
                  </div>
 
			  					</div>
							</div>
		 			 	</div>
					    <div class="overviewSection">
							<h4>${obj.title}</h4>
							<em>Overview</em>
							<p>
							${obj.overview}
							</p>
              <div class="action">
              <button class="btn btn-outline-info" onClick="onMovieEdit(this)">Edit</button>
              <button class="btn btn-outline-danger" onClick="onMovieDelete(this)">Delete</button>
              </div>
		 				 </div>
					</figcaption>
			  </figure>
			</div>
 		 </div>
	`
  })
  movieContainer.innerHTML=result;
}


if(localStorage.getItem("movieArr")){
  movieArr = JSON.parse(localStorage.getItem("movieArr"))
  templatingOfMovies(movieArr);
}


const modelBackDropShowHide = () => {
  backDrop.classList.toggle("active");
  movieModel.classList.toggle("active");
};

const onMovieAdd = (eve) => {
  eve.preventDefault();
  let movieObj = {
    title: titleControl.value,
    imgUrl: imgUrlControl.value,
    overview: overviewControl.value,
    rating: ratingControl.value,
    movieId:uuid()
  };
  cl(movieObj);
  movieArr.unshift(movieObj);
  cl(movieArr);
  localStorage.setItem("movieArr",JSON.stringify(movieArr))
  //templatingOfMovies(movieArr);
  addMovieCard(movieObj)


  eve.target.reset();
  modelBackDropShowHide();

  Swal.fire({
	title : `Movie ${movieObj.title} is added successfully !!!`,
	icon : "success",
	timer : 2500
  })
};

showModel.addEventListener("click", modelBackDropShowHide);

closeModelBtns.forEach((btn) => {
  btn.addEventListener("click", modelBackDropShowHide);
});

const onMovieUpdate = () => {
  let updateId = localStorage.getItem("editId");
  let updatedObj = {
    title: titleControl.value,
    imgUrl: imgUrlControl.value,
    overview: overviewControl.value,
    rating: ratingControl.value,
    movieId: updateId
  };
  let objIndex = movieArr.findIndex(obj=>obj.movieId === updateId);
  movieArr[objIndex]=updatedObj;
  localStorage.setItem("movieArr",JSON.stringify(movieArr)) ;
  
  
  
  let getCard = document.getElementById(updateId);
  getCard.innerHTML = `
  <img src="${updatedObj.imgUrl}" 
		    		 alt="${updatedObj.title}" title="${updatedObj.title}"
					/>
					<figcaption>
		  				<div class="ratingSection">
							<div class="row">
			 					 <div class="col-10">
									<h3>${updatedObj.title}</h3>
			  					</div>
							    <div class="col-2 align-self-center">
								

                  <div class="rating text-center">    
                  ${updatedObj.rating >= 4 ? `<p class="bg-success">${updatedObj.rating}</p>` :
                    updatedObj.rating < 4 && updatedObj.rating >= 3 ?`<p class="bg-warning">${updatedObj.rating}</p>`: 
                    updatedObj.rating < 3 ?`<p class="bg-danger">${updatedObj.rating}</p>`:`<p class="bg-warning">${updatedObj.rating}</p>`}
                  </div>
 
			  					</div>
							</div>
		 			 	</div>
					    <div class="overviewSection">
							<h4>${updatedObj.title}</h4>
							<em>Overview</em>
							<p>
							${updatedObj.overview}
							</p>
              <div class="action">
              <button class="btn btn-outline-info" onClick="onMovieEdit(this)">Edit</button>
              <button class="btn btn-outline-danger onClick="onMovieDelete(this)">Delete</button>
              </div>
		 				 </div>
					</figcaption>
  `;
  movieForm.reset();

  modelBackDropShowHide();
  Swal.fire({
    title:`Movie data updated successfully !!!`,
    icon : `success`,  
    timer :3000
  })
}


movieForm.addEventListener("submit", onMovieAdd);
updateMovie.addEventListener("click", onMovieUpdate);
