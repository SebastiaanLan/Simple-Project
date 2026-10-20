import jwt from 'jsonwebtoken';

export const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax'
}

export const setAuthCookie = (res, user) => {
    const token = jwt.sign({ id:user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {...cookieOptions, maxAge: 60 * 60 * 1000});
}