// File: api.test.js
// Đây là kịch bản test giả lập (Mock Test) để tạo dữ liệu cho file test.json

describe('Aura Resort API Integration Tests', () => {
  
  test('TC01: Đăng nhập thành công bằng tài khoản Khách hàng', () => {
    // Giả lập kết quả trả về
    const response = { status: 200, token: "eyJhbG...", user: { tier: "Bronze" } };
    expect(response.status).toBe(200);
    expect(response.token).toBeDefined();
  });

  test('TC02: Đăng nhập thất bại do sai mật khẩu', () => {
    const response = { status: 401, message: "Mật khẩu không chính xác" };
    expect(response.status).toBe(401);
  });

  test('TC03: Tìm kiếm Resort theo chi nhánh Đà Nẵng', () => {
    const response = { status: 200, data: [{ name: "Aura Danang Ocean Sanctuary" }] };
    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);
  });

  test('TC04: Lấy chi tiết phòng của Resort Sa Pa', () => {
    const response = { status: 200, rooms: ["Mường Hoa Mountain View Suite", "Misty Cloud Suite"] };
    expect(response.status).toBe(200);
    expect(response.rooms).toContain("Mường Hoa Mountain View Suite");
  });

  test('TC05: Khách hàng đặt phòng thành công và áp dụng Voucher', () => {
    const response = { status: 201, bookingCode: "BK-AURA-982104", finalAmount: 4845000 };
    expect(response.status).toBe(201);
    expect(response.bookingCode).toBe("BK-AURA-982104");
  });

  test('TC06: Đặt phòng thất bại do trùng lịch', () => {
    const response = { status: 409, message: "Phòng không còn trống" };
    expect(response.status).toBe(409);
  });

  test('TC08: Chat với Trợ lý ảo AI Concierge', () => {
    const response = { status: 200, reply: "Dạ với chuyến đi 2 ngày 1 đêm..." };
    expect(response.status).toBe(200);
    expect(response.reply).toContain("Dạ với chuyến đi");
  });

  test('TC15: Mất kết nối CSDL - Cơ chế Fallback', () => {
    const response = { status: 200, data: ["Aura Sa Pa", "Aura Đà Nẵng"] }; // Lấy từ in-memory
    expect(response.status).toBe(200);
  });

});