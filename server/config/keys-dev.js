
export default {
    loginJwt: {
        secretOrPrivateKey: "X5xUjKdxxx4-.9kbcuqwzxc--23kv,df594.41239zsc92231",
        expiresIn: '1d'
    },
    session: {
        cookieKey: "iCtkGVe0-15asd12315sax-xJkLm2K2220XlkD",
        name: "hammerstout_s",
        secret: "iCtkGVe0-4FKIGgBopL2QUM9K-jIK9miZhQExxxx2xuxxxx",
        maxAge: 24 * 60 * 60 * 1000
    },
    jwt: {
        secretOrPrivateKey: "AAAABB3L-X59kbcuqwzxc--23kv,df594.41239zsc92231",
        secretOrPrivateKey2: "2DCtkGVe-jifmqs53v6sbgg05u3fkbcDuDxDDqwzD2xc--23kv,df594.0ut79s41qi0lhg",
        secretOrPrivateKey3: "X59kbcuqwzxc-VcMFhXkPjVaIjz--23kv,df594.df594xxx",
        expiresIn: '2d'
    },
    media:{
        url:"https://hammerstout-admin.herokuapp.com/media/"
    },
    origin: {
        url: "https://hammerstout-admin.herokuapp.com/",
        datafeed: "https://hammerstout-admin.herokuapp.com/"
    },
    passport: {
        secretOrPrivateKey: "xg-.ff2dx--23kv,dax2DD.41239zsc92231",
    },
    rajasms: {
        key: process.env.RAJA_SMS,
        username: process.env.RAJA_SMS_USERNAME
    },
    midtrans: {
        url: "https://api.sandbox.midtrans.com",
        id: process.env.MIDTRANS_ID,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        isProduction: false
    },
    rajaongkir: {
        key: process.env.RAJA_ONGKIR_KEY,
        originId: 23,
        name: "bandung",
    },
    database: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE
    },
    instagram: {
        access_token: '4349263588.1677ed0.2961079b3f7e4edea6130da9e50dd3fd',
        clientID: process.env.INSTAGRAM_ID,
        clientSecret: process.env.INSTAGRAM_SECRET,
        redirect: 'https://hammerstout-admin.herokuapp.com/api/instagram/refresh/token'
    },
    mode: {
        active: true,
        key: "2DCtkGVe-x6789jifmqs53v%^&@$6sbgg05u3fkbcDuDxDDqwzD2xc--23kv,df594.0ut79s41qi0lhg",
        api:'http://localhost:40000/v1/api/maitance/mode/change'
    }
}