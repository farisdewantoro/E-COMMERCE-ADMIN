import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import connection from './config/conn';
import session from 'express-session';
import csrf from 'csurf'
import cors from 'cors'
import keys from './config/keys';
import uuidv4 from 'uuid/v4';
import authPassport from './config/passport';
import { 
    OrderRoutes,
    CategoryRoutes,
    ProductRoutes,
    AuthRoutes,
    TrackRoutes,
    SliderRoute,
    LookbookRoutes,
    VoucherRoutes,
    SizingRoutes,
    CollectionRoutes,
    MailRoutes,
    CsvRoutes,
    UserRoutes,
    ResiRoutes,
    NotificationRoutes,
    PdfRoutes,
    MediaRoutes,
    InstagramRoutes,
    TransactrionRoutes,
    ModeRoutes
} from './modules';
import {ensureAuthenticated} from './config/auth';
import path from 'path';
import fileUpload  from 'express-fileupload'
import sess from "express-mysql-session";
import cron from './cronJob';

const MySQLStore = sess(session);
const optionSession = {
    host:keys.database.host,
    user:keys.database.user,
    password:keys.database.password,
    database:keys.database.database,
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    schema: {
        tableName: "admin_session",
        columnNames: {
            session_id: "id",
            expires: "expires",
            data: "data"
        }
    }
};

var sessionStore = new MySQLStore(optionSession);


const app = express();

app.use(express.static('build'));
app.use(express.static('public'));
app.use('/media', express.static(path.join(__dirname, '../media')))

app.use(session({
    genid: function (req) {
        return uuidv4() // use UUIDs for session IDs
    },
    name: keys.session.name,
    secret: keys.session.secret,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    rolling: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: keys.session.maxAge, // satu hari,
        sameSite: true,
    }

}));


app.use(passport.initialize());
app.use(passport.session());
// app.use(csrf({ cookie: false }));


app.disable('x-powered-by');
app.use((req, res, next) => {
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('X-Frame-Options', 'deny');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header("Access-Control-Allow-Origin", keys.origin.url);
    // res.cookie('hammerstout_t',req.csrfToken(),{sameSite:true});

    next();
})
app.use(cors({ origin: keys.origin.url }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());



app.use('/api/', [AuthRoutes, TrackRoutes, CsvRoutes, NotificationRoutes, TransactrionRoutes])
// app.use('/api/', , [CategoryRoutes, ProductRoutes]);
app.use('/api/', ensureAuthenticated, [
    CategoryRoutes, 
    ProductRoutes, 
    SliderRoute, 
    LookbookRoutes, 
    VoucherRoutes,
    SizingRoutes,
    CollectionRoutes,
    OrderRoutes,
    MailRoutes,
    UserRoutes,
    ResiRoutes,
    PdfRoutes,
    MediaRoutes,
    InstagramRoutes,
    ModeRoutes
]);

// if (process.env.NODE_ENV === 'production') {
   app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'));
})
// }


const port = process.env.PORT || 5500;
app.listen(port, (err) => {
    if(err){
        console.log(err);
    }else{
        console.log(`Server running on port ! ${port}`);
    }
    
});