const express = require('express')
const app = express()
const _env = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const initialDataRoutes = require('./routes/admin/initialData')
const pageRoutes = require('./routes/admin/page')
const addressRoutes = require('./routes/address')
const orderRoutes = require('./routes/order')
const adminOrderRoutes = require('./routes/admin/order')
const reviewRoutes = require('./routes/review')
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
// const { requiredSignIn } = require('./common-middleware')
const path = require('path')
const cors = require('cors')
_env.config();

var port = process.env.PORT || 8080;

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://pelagios.au.auth0.com/.well-known/jwks.json'
  }),
  audience: 'pelagiosart.com',
  issuer: 'https://pelagios.au.auth0.com/',
  algorithms: ['RS256']
}).unless(['/api/check']);


mongoose
  .connect(
    `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.yeyo4.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

  // `mongodb://13.233.168.27:27017/${process.env.DATABASE_NAME}`
// mongodb://13.233.168.27:27017
// `mongodb://localhost:27017/onemart`
// mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.yeyo4.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority


app.use(cors())
// app.use(jwtCheck);
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'uploads')))
app.use('/api', initialDataRoutes);
app.use('/api', userRoutes);
app.use('/api', adminRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', cartRoutes)
app.use('/api', pageRoutes)
app.use('/api', addressRoutes)
app.use('/api', orderRoutes)
app.use('/api', adminOrderRoutes)
app.use('/api', reviewRoutes)


app.get('/api', (req, res) => {

  console.log("you are signed in")
  res.send("you are logged in")
})


app.listen(process.env.PORT||2000, () => {
  console.log(`server running pn port number ${process.env.PORT?process.env.PORT:2000}`)
})

