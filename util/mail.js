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

const newUserInvite = (employee, url) =>
  ( process.env.NODE_ENV === "test" )
    ? null
    : send({
      from : process.env.MAIL_USER,
      to : employee.email,
      subject : "Sauma || Tervetuloa uusi käyttäjä!",
      html : `<h3>SAUMA toivottaa sinut tervetulleeksi, ${employee.firstName}</h3>
        <p>Käyttäjänimesi on <strong>${employee.username}</strong>. Jos ei miellytä, voit vaihtaa sen kirjauduttuasi.</p>
        <p>Ensin sinun on asetettava salasana. Tee niin seuraamalla <a href='${url}'>tätä linkkiä</a>, sinä senkin könsikäs.</p>
        <p>Huomaathan, että linkki on yksilöity, ja voimassa vain vuorokauden tämän sähköpostin lähetysajasta. Jos olet niin hidas että se ehtii mennä happamaksi, voit uusia salasanan vaihtopyynnön Sauman etusivulla.</p>
        <p>Ja varsinainen sovellushan löytyy <a href='https://sauma.herokuapp.com/'>täältä</a></p>
        <p>Parhain terveisin, Sauman sposti-botti</p>`
    })

const passwordReset = (email, url) =>
  ( process.env.NODE_ENV === "test" )
    ? null
    : send({
      from : process.env.MAIL_USER,
      to : email,
      subject : "Sauma || Unohtuiko salasana?",
      html : `<p>Seuraa oheista linkkiä asettaaksesi uuden salasanan:</p>
        <a href='${url}'>Salasanan vaihto</a>
        <p>Huomaathan, että linkki on yksilöity, ja voimassa vain vuorokauden tämän sähköpostin lähetysajasta.</p>
        <p>Jos et ole pyytänyt salasanan vaihtoa, niin nyt kannattaa panikoida -- jollain lienee pahat mielessä!</p>`
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
