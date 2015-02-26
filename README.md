#Pickups As A Service (PaaS)

Make sure to populate the database by running `aquire.js`.

##Endpoints

* `/api/random`
  Returns a random pickup line

  `?category=$category` - Can filter possibilities by category

* `/api/pickups`
  Returns all pickups

  `?category=$category` - Can filter by category

##Categories
* `top`
* `jokes`
* `cheesy`
* `flattering`
* `funny`
* `suggestive`

##Example Call

`/api/random?category=funny`


    {
    _id: "54ee96d1603653466d0e1297",
    category: "funny",
    text: "It's a good thing I wore my gloves today; otherwise, you'd be too hot to handle.",
    rating: 276,
    __v: 0
    }
