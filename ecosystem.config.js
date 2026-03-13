  module.exports = {
    apps: [
      {
        name: 'user-service',
        script: 'node /user-service/index.js',
        watch: true, 
        env: {
          NODE_ENV: 'production',
          PORT: 7000,
          MONGO_URI: 'mongodb+srv://vaishalisparkleweb:7FYTp7cRwyp884t1@cluster0.uhyfm.mongodb.net/Users',
          JWT_SECRET:'5X#b1@r3Gt!A8qJ*2C!u$z0Xw@o1S#l9K$m6H'
        }
      },
      {
        name: 'category-service',
        script: 'node /category-service/index.js',
        watch: true,
        env: {
          NODE_ENV: 'production',
          PORT: 7001,
          MONGO_URI: 'mongodb+srv://vaishalisparkleweb:7FYTp7cRwyp884t1@cluster0.uhyfm.mongodb.net/Category',
          USER_SERVICE: 'http://localhost:4000/api/users',
          JWT_SECRET:'5X#b1@r3Gt!A8qJ*2C!u$z0Xw@o1S#l9K$m6H'
        }
      },
      {
        name: 'quote-service',
        script: 'node /quote-service/index.js',
        watch: true,
        env: {
          NODE_ENV: 'production',
          PORT: 7002,
          MONGO_URI: 'mongodb+srv://vaishalisparkleweb:7FYTp7cRwyp884t1@cluster0.uhyfm.mongodb.net/Quote',
          USER_SERVICE: 'http://localhost:4000/api/users',
          CATEGORY_SERVICE: 'http://localhost:4001/api/category',
          SUBCATEGORY_SERVICE: 'http://localhost:4001/api/sub-category',
          JWT_SECRET:'5X#b1@r3Gt!A8qJ*2C!u$z0Xw@o1S#l9K$m6H'
        }
      }
    ]
  };
