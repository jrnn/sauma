const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport(
  {
    host : "smtp.gmail.com",
    port : 465,
    secure : true,
    auth : {
      user : process.env.MAIL_USER,
      pass : process.env.MAIL_PW
    }
  }
)

const newUserInvite = (employee, homeUrl, resetUrl) =>
  ( process.env.NODE_ENV === "test" )
    ? null
    : send({
      from : process.env.MAIL_USER,
      to : employee.email,
      subject : "Sauma || Tervetuloa!",
      html : `<h3>Tervetuloa SAUMA:n käyttäjäksi, ${employee.firstName}!</h3>
        <p>Käyttäjänimesi on <strong>${employee.username}</strong>. Voit vaihtaa sen kirjauduttuasi.</p>
        <p>Ensin sinun on asetettava salasana. Tee niin seuraamalla <a href='${resetUrl}'>tätä linkkiä</a>.</p>
        <p>Huomaathan, että linkki on yksilöity, ja voimassa vain vuorokauden tämän viestin lähetysajasta. Jos se ehtii mennä happamaksi, voit uusia salasanan vaihtopyynnön Sauman etusivulla.</p>
        <p>Ja varsinainen sovellushan löytyy <a href='${homeUrl}'>täältä</a>.</p>
        <p>Parhain terveisin, Sauman sposti-botti</p>`
    })

const passwordReset = (email, url) =>
  ( process.env.NODE_ENV === "test" )
    ? null
    : send({
      from : process.env.MAIL_USER,
      to : email,
      subject : "Sauma || Unohtuiko salasana?",
      html : `<h3>SAUMA salasana vaihtoon</h3>
        <p>Seuraa <a href='${url}'>tätä linkkiä</a> asettaaksesi uuden salasanan.</p>
        <p>Huomaathan, että linkki on yksilöity, ja voimassa vain vuorokauden tämän viestin lähetysajasta.</p>
        <p>Jos et ole pyytänyt salasanan vaihtoa, niin nyt kannattaa panikoida -- jollain lienee pahat mielessä!</p>
        <p>Parhain terveisin, Sauman sposti-botti</p>`
    })

const send = (options) =>
  transporter.sendMail(options, (error, result) => {
    if ( error )
      console.log(error)
    else
      console.log("Email sent successfully:",result.response)
  })

module.exports = {
  newUserInvite,
  passwordReset
}
