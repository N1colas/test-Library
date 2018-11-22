const port = process.env.PORT || 3000;

const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const book = require('./models/bookModel');

const app = express();

const nav = [
  { link: '/books', title: 'Books' },
  { link: '/author', title: 'Author' },
  { link: '/genre', title: 'genre' },
];

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));
require('./src/config/passport.js')(app);


app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');


const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);


// app.use((res, req, next) => {
//   debug('MyMiddleware');
//   next();
// });

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Mytitle',
    nav,
  });
});

app.listen(port, () => {
  debug(`listing from port ${chalk.bold(port)}`);
});
