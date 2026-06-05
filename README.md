# MLN111 Quiz App

Đây là một ứng dụng web trắc nghiệm giúp ôn tập môn MLN111 với 521 câu hỏi. Ứng dụng được viết bằng HTML, CSS, và JavaScript thuần, kết hợp với giao diện Dark Mode cao cấp.

## Tính năng
- **521 Câu hỏi Trắc nghiệm**: Câu hỏi và đáp án được lấy từ các file `.md`.
- **Hỗ trợ chọn nhiều đáp án**: Tương thích với các câu hỏi chọn 1, 2, 3 đáp án.
- **Thanh tìm kiếm**: Dễ dàng nhảy đến bất kỳ câu hỏi nào.
- **Giao diện hiện đại**: Dark mode, glassmorphism, và animation mượt mà.

## Cách chạy ứng dụng
Chạy trực tiếp file `quiz-app/index.html` trên trình duyệt hoặc sử dụng local server:

```bash
cd quiz-app
npx serve .
```

## Cấu trúc thư mục
- `MLN111_cau_xxx.md`: Các file markdown chứa câu hỏi gốc.
- `parse.js`: Script NodeJS dùng để parse file Markdown sang `questions.json` và `questions.js`.
- `quiz-app/`: Thư mục chứa giao diện web (HTML, CSS, JS).
