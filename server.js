const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // เรียกใช้ Mongoose
const app = express();

app.use(cors());
app.use(express.json());

// 1. เชื่อมต่อกับ MongoDB Atlas
// ตัวอย่างที่ถูกต้อง (อย่าลืมเปลี่ยน <db_password> เป็นรหัสผ่านที่คุณตั้งไว้)
const mongoURI = 'mongodb+srv://arnanch_db_user:iGfn6N1Sj1eNDNwK@cluster0.jpcek17.mongodb.net/?retryWrites=true&w=majority';

//const mongoURI = 'YOUR_CONNECTION_STRING_HERE'; 
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB Atlas! ✅'))
    .catch(err => console.error('Connection error: ❌', err));

// 2. สร้าง "พิมพ์เขียว" (Schema) ของข้อมูลเพื่อน
const friendSchema = new mongoose.Schema({
    name: String,
    status: String,
    createdAt: { type: Date, default: Date.now }
});

// 3. สร้าง Model จาก Schema
const Friend = mongoose.model('Friend', friendSchema);

// GET: ดึงข้อมูลจาก MongoDB
app.get('/api/friends', async (req, res) => {
    const friends = await Friend.find(); // หาเพื่อนทุกคนใน DB
    res.json(friends);
});

// POST: เพิ่มข้อมูลลง MongoDB
app.post('/api/friends', async (req, res) => {
    const newFriend = new Friend({
        name: req.body.name,
        status: 'Online'
    });
    await newFriend.save(); // บันทึกลง Cloud
    res.json(newFriend);
});

// Route สำหรับ "ลบ" เพื่อน (DELETE)
app.delete('/api/friends/:id', async (req, res) => {
  try {
      const friendId = req.params.id; // รับ ID จาก URL
      await Friend.findByIdAndDelete(friendId); // สั่ง MongoDB ให้ลบตัวนี้ทิ้ง
      res.json({ message: 'ลบชื่อเพื่อนสำเร็จแล้ว!' });
  } catch (err) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบ' });
  }
});

// ใช้พอร์ตที่ Render กำหนดมาให้ ถ้าไม่มี (รันในเครื่อง) ให้ใช้ 3000
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});