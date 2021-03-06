const Ngo = require("../models/NgoModel");
const formidable = require("formidable");
const fs = require("fs");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const fast2sms = require('fast-two-sms');
const twilio = require("twilio");
require("dotenv").config();

var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken, {
  lazyLoading: true
});

const myNo = +12056193915

exports.newNgo = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    const { NgoId, NgoRegNo, NgoHead, NgoSector, email, password, name, phoneNo } = fields;

    if (!NgoId || !NgoRegNo || !NgoHead || !NgoSector || !email || !password || !name || !phoneNo) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let newNGO = new Ngo(fields);

    //handle file here
    if (file.AadharPhoto) {
      if (file.AadharPhoto.size > 300000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      newNGO.AadharPhoto.data = fs.readFileSync(file.AadharPhoto.path);
      newNGO.AadharPhoto.contentType = file.AadharPhoto.type;
    }
    if (file.NgoRegCertificate) {
      if (file.NgoRegCertificate.size > 300000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      newNGO.NgoRegCertificate.data = fs.readFileSync(file.NgoRegCertificate.path);
      newNGO.NgoRegCertificate.contentType = file.NgoRegCertificate.type;
    }

    //save to the DB
    newNGO.save(async (err, NGO) => {
      if (err) {
        res.status(400).json({
          error: "Saving product in DB failed. check the NgoId, registation no ans email",
        });
      }
      try {
        await client.messages.create({
          body: "Your Form has been successfully submited to MWCD (Govt. of India)",
          to: "+91" + NGO.phoneNo,
          from: myNo
        })
      }
      catch (err) {
        // your catch block code goes here
      }
      return res.status(201).json({
        error: "",
        success: "Data successfully saved"
      });
    });
  });
}

exports.getNgo = async (req, res) => {
  const NgoInfo = await Ngo.find({ _id: req.params.id }, function (err, value) {
    if (err) {
      return res.status(404).json({
        error: "NGO not found",
      });
    }
    try {
      value[0].AadharPhoto = undefined;
      value[0].NgoRegCertificate = undefined;
    }
    catch{

    }
    return res.send(value);
  });

}

exports.getAllNgo = async (req, res) => {
  const value = await Ngo.find({}, (err, data) => {
    if (err) {
      return res.json({
        message: "No Ngo found"
      })
    }
    for (let i = 0; i < data.length; i++) {
      data[i].NgoRegCertificate = undefined;
      data[i].AadharPhoto = undefined;
    }
    return res.send(data)
  })
}

exports.pendingNgo = async (req, res) => {
  const value = await Ngo.find({ Status: "Pending" }, (err, data) => {
    if (err) {
      return res.json({
        message: "No Ngo found"
      })
    }
    for (let i = 0; i < data.length; i++) {
      data[i].NgoRegCertificate = undefined;
      data[i].AadharPhoto = undefined;
    }
    return res.send(data)
  })
}

exports.getAadhar = async (req, res) => {
  const aadhar = await Ngo.find({ _id: req.params.id }, function (err, photo) {
    if (err) {
      return res.status(404).json({
        error: "Aadhar card not found",
      });
    }
    res.set("Content-Type", photo[0].AadharPhoto.contentType);
    return res.send(photo[0].AadharPhoto.data);
  });
}

exports.getCertificate = async (req, res) => {
  const certificate = await Ngo.find({ _id: req.params.id }, function (err, photo) {
    if (err) {
      return res.status(404).json({
        error: "Certificate not found",
      });
    }
    res.set("Content-Type", photo[0].NgoRegCertificate.contentType);
    return res.send(photo[0].NgoRegCertificate.data);
  });
}

exports.ngoLogin = async (req, res) => {
  const { email, password } = req.body
  Ngo.find({ email: email }, async function (err, ngo) {
    if (err || ngo[0] == null) {
      return res.status(404).json({
        error: "Ngo details not found",
      });
    }
    if (ngo[0].password !== password) {
      return res.status(401).json({
        error: "Password does not match",
      });
    }
    const token = jwt.sign({ _id: ngo._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 });
    const { email, NgoId, NgoRegNo, role, _id } = ngo[0];
    return res.json({ token, user: { _id, email, NgoId, NgoRegNo, role } });
  })
}

exports.rejectedForm = async (req, res) => {
  const ngo = await Ngo.find({ _id: req.params.id }, async function (err, ngo) {
    if (err) {
      return res.status(404).json({
        error: "Ngo details not found",
      });
    }
    ngo[0].Status = "Rejected";
    let recieve = req.body.formReason;
    if (recieve) {
      ngo[0].formReason = recieve;
      await client.messages.create({
        body: "Your Form request has been rejected by the MWCD (Govt. of India). Login to see more details",
        to: "+91" + ngo[0].phoneNo,
        from: myNo
      })
      await ngo[0].save()
      return res.json({ message: "Ngo Form Rejected" })

    }
    console.log("lol")
    return res.json({ error: "Please fill complete information" })
  });
}

exports.approveForm = async (req, res) => {
  const certificate = await Ngo.find({ _id: req.params.id }, async function (err, ngo) {
    if (err) {
      return res.status(404).json({
        error: "Ngo details not found",
      });
    }
    ngo[0].Status = "Approved";
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    ngo[0].formReason = "Application approved on " + today;
    await ngo[0].save();
    await client.messages.create({
      body: "Your Form request has been approved by the MWCD (Govt. of India). Now you can fill loan forms",
      to: "+91" + ngo[0].phoneNo,
      from: myNo
    })
    return res.json({ message: "Ngo form approved" })
  })
}

exports.blackList = async (req, res) => {
  const certificate = await Ngo.find({ _id: req.params.id }, async function (err, ngo) {
    if (err) {
      return res.status(404).json({
        error: "Ngo details not found",
      });
    }
    ngo[0].Status = "Rejected";
    ngo[0].formReason = "Blacklisted";
    client.messages.create({
      body: "Your Form request has been blacklisted by the MWCD (Govt. of India). Login to see more details",
      to: "+91" + ngo[0].phoneNo,
      from: myNo
    })
    await ngo[0].save()
    return res.json({ message: "Ngo form blacklisted" })
  })
}

exports.updateForm = async (req, res) => {
  Ngo.findById(req.params.id, function (err, data) {
    if (!data) {
      return res.status(404).json({
        error: "NGO not found",
      });
    }
    if (data.Status === "Pending" || data.Status === "Rejected") {
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.parse(req, (err, fields, file) => {
        if (err) {
          return res.status(400).json({
            error: "problem with image",
          });
        }

        const { NgoId, NgoRegNo, NgoHead, NgoSector, email, password, name } = fields;
        data.NgoId = NgoId;
        data.NgoRegNo = NgoRegNo;
        data.NgoHead = NgoHead;
        data.NgoSector = NgoSector;
        data.email = email;
        data.password = password;
        data.name = name;
        //handle file here
        if (file.AadharPhoto) {
          if (file.AadharPhoto.size > 300000) {
            return res.status(400).json({
              error: "File size too big!",
            });
          }
          data.AadharPhoto.data = fs.readFileSync(file.AadharPhoto.path);
          data.AadharPhoto.contentType = file.AadharPhoto.type;
        }
        if (file.NgoRegCertificate) {
          if (file.NgoRegCertificate.size > 300000) {
            return res.status(400).json({
              error: "File size too big!",
            });
          }
          data.NgoRegCertificate.data = fs.readFileSync(file.NgoRegCertificate.path);
          data.NgoRegCertificate.contentType = file.NgoRegCertificate.type;
        }

        //save to the DB
        data.save((err, NGO) => {
          if (err) {
            res.status(400).json({
              error: "Saving product in DB failed",
            });
          }
          return res.send(data)
        });
      });
    }
    else {
      return res.json({
        message: "Can not update Application because the application is already approved!"
      })
    }
  })
}

exports.updateLoginCred = async (req, res) => {
  Ngo.findById(req.params.id, async function (err, data) {
    if (!data) {
      return res.status(404).json({
        error: "NGO not found",
      });
    }
    const newEmail = req.body.email;
    const newPassword = req.body.password;
    if (newEmail && newPassword) {
      data.email = newEmail;
      data.password = newPassword;
      await data.save();
      return res.json({
        email: data.email,
        password: data.password
      })
    }
    return res.json({ message: "Enter all the fields" })
  })
}