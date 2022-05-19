const express = require("express");
const { pool } = require("../../config");
const router = express.Router();
const { generateToken, isAuth } = require("./auth-jwt");
const bcrypt = require("bcrypt");

router.post("/auth/login", async (req, res, next) => {
  const { username, password } = req.body;
  console.log("auth/login", req.body);
  const [[user]] = await pool.query(
    ` SELECT staff_id, staff_username, staff_password_hash
      FROM staffs 
      WHERE staff_username = ?`,
    [username]
  );

  //console.log(await bcrypt.hash(password, 5));

  try {
    console.log(user);
    if (!user) {
      throw new Error("Incorrect username or password");
    }

    if (!(await bcrypt.compare(password, user.staff_password_hash))) {
      throw new Error("Incorrect username or password");
    }

    const accessToken = generateToken({
      staff_id: user.staff_id,
      username: user.staff_username,
      name: user.staff_name,
    });
    return res.json({
      user: {
        token: accessToken,
      },
    });
  } catch (error) {
    res.status(400).json(error.toString());
  }
});

router.get("/auth/me", isAuth, async (req, res) => {
  const { uid } = req.user;
  console.log("requser", req.user);
  const [[user]] = await pool.query(
    ` SELECT staff_name, staff_username
      FROM staffs 
      WHERE staff_id = ?`,
    [uid]
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid User",
    });
  }

  return res.json({
    user: {
      user_id: user.staff_id,
      username: user.staff_username,
      name: user.staff_name,
    },
  });
});

// router.get("/profile/:username", isAuth, async (req, res) => {
//   const [[existUser]] = await pool.query(
//     ` SELECT *
//       FROM account
//       WHERE username = ?`,
//     [req.params.username]
//   );

//   if (existUser) {
//     if (existUser.role === "student") {
//       const [[user]] = await pool.query(
//         ` SELECT username, student_id, first_name, last_name, email, program_name, role
//           FROM account
//           JOIN student
//           USING (account_id)
//           JOIN program
//           USING (program_id)
//           WHERE username = ?`,
//         [req.params.username]
//       );
//       return res.json(user);
//     } else if (existUser.role === "staff") {
//       const [[user]] = await pool.query(
//         ` SELECT username, first_name, last_name, email, role
//           FROM account
//           WHERE username = ?`,
//         [req.params.username]
//       );
//       return res.json(user);
//     }
//   }
//   return res.status(401).json({
//     message: "Invalid User",
//   });
// });

// const editProfileSchema = Joi.object({
//   currentPassword: Joi.string().required().min(8),
//   newPassword: Joi.string().required().min(8),
// });

// router.put("/profile", isAuth, async (req, res, next) => {
//   try {
//     await editProfileSchema.validateAsync(req.body, { abortEarly: false });
//   } catch (err) {
//     return res.status(400).send(err);
//   }

//   const { currentPassword, newPassword } = req.body;
//   const { uid } = req.user;

//   const conn = await pool.getConnection();
//   await conn.beginTransaction();

//   try {
//     //Get user current password
//     const [[user]] = await conn.query(
//       ` SELECT password
//         FROM account
//         WHERE account_id = ?`,
//       [uid]
//     );

//     //Check if newPassword is same as currentPassword
//     if (
//       (await bcrypt.compare(currentPassword, user.password)) &&
//       (await bcrypt.compare(newPassword, user.password))
//     ) {
//       return res.json({
//         status: "sameAs",
//       });
//     }

//     //Check if currentPassword is incorrect
//     if (!(await bcrypt.compare(currentPassword, user.password))) {
//       return res.json({
//         status: "incorrect",
//       });
//     }

//     let sql = `
//               UPDATE account
//               SET password = ?
//               WHERE account_id = ?`;
//     let params = [await bcrypt.hash(newPassword, 5), uid];

//     await conn.query(sql, params);
//     res.json({
//       status: "changed",
//     });
//     conn.commit();
//   } catch (err) {
//     console.log(err);
//     conn.rollback();
//     res.status(400).json(err.toString());
//   } finally {
//     conn.release();
//   }
// });

module.exports = router;
