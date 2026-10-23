import path from 'node:path';
import { mkdir, unlink, access } from 'node:fs/promises';

import User from '../models/User.js';

const avatarDir = path.resolve('uploads/avatars');

export const uploadUserAvatar = async (req, res) => {
    let newFilename;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image found' })
        }

        const image = req.file.buffer;

        await mkdir(avatarDir, { recursive: true });

        const user = await User.findByPk(Number(req.user.id));

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        newFilename = `${user.id}.webp`;
        const newPath = path.join(avatarDir, newFilename);

        const { writeFile } = await import('node:fs/promises');
        await writeFile(newPath, image, { flag: 'w' });

        const oldAvatar = user.avatar;

        await user.update({ avatar: newFilename })

        if (oldAvatar) {
            try {
                await unlink(path.join(avatarDir, path.basename(oldAvatar)));
            } catch (err) {
                console.error(err);
            }
        }

        return res.status(200).json({ avatar: user.avatar })
    } catch (err) {
        if (newFilename) {
            try {
                await unlink(path.join(avatarDir, newFilename));
            } catch (err) {
                console.error(err);
            }

            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

export const getUserAvatar = async (req, res) => {
    try {
        const user = await User.findByPk(Number(req.user.id));

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const filename = path.basename(user.avatar);
        const avatarPath = path.join(avatarDir, filename);

        await access(avatarPath);

        return res.sendFile(avatarPath);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' })
    }
}