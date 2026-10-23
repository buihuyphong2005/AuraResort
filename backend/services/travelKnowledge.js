/**
 * AuraResort Travel Knowledge & Intelligent Tourism Engine
 * Comprehensive Vietnam Tourism Database, Itinerary Planner & Cultural Expert
 */

export const DESTINATION_DATA = {
  sapa: {
    name: 'Sa Pa (Lào Cai)',
    tagline: 'Chốn bồng lai tiên cảnh giữa biển mây Hoàng Liên Sơn',
    hotel: {
      id: 'hotel-sapa',
      name: 'Aura Sapa Misty Peak Retreat',
      priceFrom: '2.850.000đ/đêm',
      highlight: 'Lò sưởi củi tự nhiên, bồn tắm gỗ pơ-mu ngâm thảo dược người Dao Đỏ, bể bơi nước nóng bốn mùa view thung lũng Mường Hoa'
    },
    itineraries: {
      '3n2d': {
        title: 'Lịch trình 3 Ngày 2 Đêm: Săn Mây, Chinh Phục Fansipan & Bản Sắc Tây Bắc',
        days: [
          {
            day: 'Ngày 1: Chạm ngõ Sa Pa - Khám phá Bản làng di sản Cát Cát',
            morning: 'Đến Sa Pa nhận phòng hoặc gửi hành lý. Thưởng thức ly cafe nóng ngắm sương sớm quanh Hồ Sa Pa và Nhà thờ Đá cổ kính.',
            afternoon: 'Trekking xuống Bản Cát Cát - Tả Van bên dòng suối Mường Hoa róc rách. Check-in cối xay nước khổng lồ, xem nghệ nhân người H’Mông dệt lanh và vẽ sáp ong truyền thống.',
            evening: 'Thưởng thức đại tiệc Lẩu cá hồi & cá tầm tươi Sa Pa cùng đĩa rau cải mèo xào tỏi thơm lừng. Buổi tối dạo phố Cầu Mây nướng than hoa ngào ngạt.'
          },
          {
            day: 'Ngày 2: Chinh phục đỉnh Fansipan 3.143m - Liệu pháp Tắm lá thuốc Dao Đỏ',
            morning: 'Khởi hành chuyến cáp treo ba dây vượt thung lũng Mường Hoa lên Nóc Nhà Đông Dương Fansipan (3.143m). Chiêm bái Đại tượng Phật bằng đồng và săn biển mây cuồn cuộn.',
            afternoon: 'Trải nghiệm ngâm mình trong bồn gỗ pơ-mu với bài thuốc tắm 30+ loại thảo dược cổ truyền của người Dao Đỏ tại bản Tả Phìn, giúp phục hồi sinh lực và lưu thông khí huyết.',
            evening: 'Quây quần bên lò sưởi ấm cúng, thưởng thức thịt lợn cắp nách nướng mắc khén, nhâm nhi chén rượu táo mèo cay nồng và lắng nghe điệu khèn gọi bạn tình.'
          },
          {
            day: 'Ngày 3: Ngoạn cảnh Đèo Ô Quy Hồ - Mua đặc sản vùng cao làm quà',
            morning: 'Chinh phục Đèo Ô Quy Hồ - một trong “Tứ đại đỉnh đèo” Tây Bắc. Check-in Cổng Trời và Cầu Kính Rồng Mây ngắm toàn cảnh dãy Hoàng Liên Sơn hùng vĩ.',
            afternoon: 'Ghé chợ trung tâm Sa Pa chọn mua thịt trâu gác bếp, nấm hương rừng, hạt dẻ nướng và măng khô Tây Bắc trước khi lên xe trở về.'
          }
        ]
      },
      '2n1d': {
        title: 'Lịch trình 2 Ngày 1 Đêm: Kỳ Nghỉ Chữa Lành Nhanh Tại Sa Pa',
        days: [
          {
            day: 'Ngày 1: Check-in Mường Hoa - Bản Cát Cát - Tắm lá Dao Đỏ',
            morning: 'Đến Sa Pa, check-in ngắm view thung lũng Mường Hoa.',
            afternoon: 'Trekking bản Cát Cát, trải nghiệm tắm bồn lá thuốc Dao Đỏ ấm nóng.',
            evening: 'Thưởng thức lẩu cá tầm và đồ nướng Sa Pa phố cổ.'
          },
          {
            day: 'Ngày 2: Đỉnh Fansipan - Chợ phiên Sa Pa',
            morning: 'Chinh phục đỉnh Fansipan bằng cáp treo ngắm biển mây đại ngàn.',
            afternoon: 'Mua sắm đặc sản hạt dẻ, thịt trâu gác bếp và trở về.'
          }
        ]
      }
    },
    food: [
      { name: 'Lẩu cá tầm & Cá hồi Sa Pa', desc: 'Cá hồi, cá tầm nuôi tự nhiên tại chân thác Bạc, thịt chắc ngọt, nhúng nước lẩu chua cay ăn cùng rau cải mèo, nấm hương tươi.' },
      { name: 'Thịt trâu gác bếp & Lợn cắp nách', desc: 'Thịt trâu hun khói củi nhãn tẩm ướp hạt dổi, mắc khén chuẩn vị; lợn bản cắp nách nướng than hoa bì giòn rụm.' },
      { name: 'Thắng cố A Quỳnh & Rau củ vùng cao', desc: 'Món ăn truyền thống đậm đà của người H’Mông kết hợp ngọn su su ngọt mát, cải mèo đắng nhẹ hậu ngọt.' },
      { name: 'Hạt dẻ rừng nướng bơ & Rượu táo mèo', desc: 'Hạt dẻ nướng vàng ươm thơm bùi ăn vặt phố lạnh cùng chén rượu ủ quả táo mèo thơm cay nồng ấm.' }
    ],
    bestSeasons: [
      { time: 'Tháng 9 - 10 (Mùa lúa chín vàng)', highlight: 'Thung lũng Mường Hoa vàng óng như dát vàng trên những thửa ruộng bậc thang kỳ vĩ, tiết trời thu trong veo, nắng dịu mát.' },
      { time: 'Tháng 12 - 2 (Mùa đông tuyết rơi & hoa mận)', highlight: 'Cơ hội săn mây và băng tuyết hiếm có trên đỉnh đèo, ngắm hoa đào, hoa mận rừng bung nở trắng xóa sườn đồi.' },
      { time: 'Tháng 4 - 5 (Mùa nước đổ & hoa đỗ quyên)', highlight: 'Ruộng bậc thang lấp lánh như mặt gương soi trời mây, rừng quốc gia Hoàng Liên rực rỡ sắc đỗ quyên nguyên sinh.' }
    ],
    cultureAndSpots: [
      'Bản Cát Cát & Tả Van: Trải nghiệm dệt thổ cẩm, nhuộm chàm, vẽ sáp ong cùng người bản địa.',
      'Tắm lá thuốc người Dao Đỏ: Bài thuốc 30+ loại lá quý đun sôi sùng sục trong thùng gỗ pơ-mu.',
      'Đỉnh Fansipan 3.143m: Nóc nhà Đông Dương, quần thể tâm linh Bích Vân Thiền Tự giữa mây ngàn.',
      'Đèo Ô Quy Hồ & Cổng Trời: Cung đèo hùng vĩ bậc nhất Việt Nam ngắm hoàng hôn ráng vàng.'
    ]
  },

  danang: {
    name: 'Đà Nẵng',
    tagline: 'Kỳ quan biển ngọc giao hòa cùng tinh hoa ngũ hành',
    hotel: {
      id: 'hotel-danang',
      name: 'Aura Danang Ocean Sanctuary',
      priceFrom: '2.450.000đ/đêm',
      highlight: 'Mặt biển Mỹ Khê, hồ bơi vô cực view bán đảo Sơn Trà, spa Onsen khoáng biển, nhà hàng hải sản 5 sao'
    },
    itineraries: {
      '3n2d': {
        title: 'Lịch trình 3 Ngày 2 Đêm: Biển Mỹ Khê, Sơn Trà, Cầu Rồng & Ngũ Hành Sơn',
        days: [
          {
            day: 'Ngày 1: Đón bình minh Mỹ Khê - Bán đảo Sơn Trà & Ngắm Voọc quý hiếm',
            morning: 'Tắm biển Mỹ Khê - một trong những bãi biển quyến rũ nhất hành tinh. Thưởng thức bữa sáng Bún chả cá Ông Tạ hoặc Mì Quảng ếch đậm đà.',
            afternoon: 'Vi vu cung đường ven biển lên Bán đảo Sơn Trà, viếng Chùa Linh Ứng ngắm tượng Phật Bà 67m hướng biển. Lên Đỉnh Bàn Cờ ngắm voọc chà vá chân nâu chuyền cành trong nắng chiều.',
            evening: 'Dạo cầu tình yêu, ngắm Cầu Rồng phun lửa và nước lúc 21h00 (thứ Bảy/Chủ Nhật). Thưởng thức hải sản Năm Đảnh hoặc Bé Mặn tươi rói.'
          },
          {
            day: 'Ngày 2: Khám phá Quần thể Bà Nà Hills - Cầu Vàng Bàn Tay Khổng Lồ',
            morning: 'Trải nghiệm cáp treo đạt nhiều kỷ lục thế giới lên đỉnh Bà Nà. Dạo bước trên Cầu Vàng uốn lượn giữa đôi bàn tay rêu phong vắt ngang mây trời.',
            afternoon: 'Check-in Làng Pháp cổ kính, vui chơi tại Fantasy Park và thưởng thức buffet ẩm thực quốc tế phong phú.',
            evening: 'Trở về thành phố, ghé chợ đêm Helio / chợ đêm Sơn Trà thưởng thức bánh tráng nướng, nem lụi và ốc hút.'
          },
          {
            day: 'Ngày 3: Danh thắng Ngũ Hành Sơn - Mua quà chợ Cồn / chợ Hàn',
            morning: 'Khám phá Động Huyền Không lung linh huyền ảo với ánh nắng rọi từ trần hang, viếng Chùa Tam Thai trên ngọn Thủy Sơn.',
            afternoon: 'Ghé làng đá mỹ nghệ Non Nước, sau đó ra chợ Hàn mua chả bò Đà Nẵng trứ danh, mực cơm rim me, cá bò khô rim cay trước khi ra sân bay.'
          }
        ]
      }
    },
    food: [
      { name: 'Bánh tráng cuốn thịt heo Đại Lộc', desc: 'Thịt heo hai đầu da luộc mềm ngọt, cuốn cùng bánh tráng phơi sương, rau ghém rừng 10 loại chấm mắm nêm đậm đà (Quán Trần, Quán Mậu).' },
      { name: 'Mì Quảng ếch & Mì Quảng tôm thịt', desc: 'Sợi mì gạo dẻo mềm, nước dùng sâm sấp đậm vị, tôm thịt kho rim ăn kèm bánh đa giòn tan và đậu phộng rang (Bếp Trang, Bà Vị).' },
      { name: 'Hải sản tươi sống Mỹ Khê', desc: 'Ghẹ hấp bia, tôm tít rang muối, ốc hương sốt bơ tỏi, chíp chíp hấp sả thơm lừng (Bé Mặn, Năm Đảnh, Cua Đỏ).' },
      { name: 'Bánh xèo & Nem lụi Bà Dưỡng', desc: 'Bánh xèo vỏ giòn rụm nhân tôm thịt giá đỗ, cuốn cùng nem lụi nướng than thơm nức chấm nước sốt gan đậu phộng gia truyền.' },
      { name: 'Chè Sầu Liên & Bún chả cá', desc: 'Chè sầu riêng béo ngậy trứ danh đường Hoàng Diệu và bát bún chả cá nóng hổi thơm vị dứa cà chua đường Lê Hồng Phong.' }
    ],
    bestSeasons: [
      { time: 'Tháng 3 - Tháng 8 (Mùa biển đẹp nhất)', highlight: 'Trời nắng vàng chan hòa, biển trong xanh màu ngọc bích, sóng êm ả, nhiệt độ lý tưởng cho mọi hoạt động thể thao biển và lặn ngắm san hô.' },
      { time: 'Tháng 9 - Tháng 11 (Mùa thu mát dịu)', highlight: 'Thành phố bước vào nhịp sống chậm rãi lãng mạn, tiết trời mát mẻ, thỉnh thoảng có mưa rào nhẹ.' }
    ],
    cultureAndSpots: [
      'Bán đảo Sơn Trà: Viên ngọc xanh của Đà Nẵng, nơi sinh sống của hơn 300 cá thể Voọc chà vá chân nâu quý hiếm.',
      'Ngũ Hành Sơn & Động Huyền Không: 5 ngọn núi Kim-Mộc-Thủy-Hỏa-Thổ linh thiêng gắn liền với di tích lịch sử và làng nghề đá Non Nước 400 năm.',
      'Cầu Rồng & Cầu Sông Hàn: Biểu tượng hiện đại vươn mình ra biển lớn của người dân xứ Đà thành.',
      'Bà Nà Hills & Cầu Vàng: Kỳ quan kiến trúc nổi tiếng toàn cầu giữa bồng bềnh mây núi Chúa.'
    ]
  },

  hoian: {
    name: 'Hội An (Quảng Nam)',
    tagline: 'Lắng đọng vẻ đẹp di sản bên dòng sông Hoài thơ mộng',
    hotel: {
      id: 'hotel-hoian',
      name: 'Aura Hoi An Ancient Heritage',
      priceFrom: '2.150.000đ/đêm',
      highlight: 'Bên sông Hoài, thuyền gỗ đưa rước ngắm phố cổ, lớp làm đèn lồng thủ công, xe đạp vi vu dạo phố & đầm rau'
    },
    itineraries: {
      '3n2d': {
        title: 'Lịch trình 3 Ngày 2 Đêm: Phố Cổ Hoa Đăng, Làng Rau Trà Quế & Rừng Dừa Bảy Mẫu',
        days: [
          {
            day: 'Ngày 1: Dạo bước phố cổ Hội An - Thả hoa đăng sông Hoài huyền diệu',
            morning: 'Đến Hội An nhận phòng. Đi bộ hoặc đạp xe dạo quanh phố cổ ngắm giàn hoa giấy rực rỡ trên nền tường vàng cổ điển.',
            afternoon: 'Thăm Chùa Cầu biểu tượng, Nhà cổ Tấn Ký, Hội quán Phúc Kiến. Thưởng thức ly nước Mót thảo mộc hoa sen thanh mát giải nhiệt.',
            evening: 'Xuôi thuyền gỗ trên sông Hoài, thắp nến thả hoa đăng giấy mộc cầu bình an. Thưởng thức Cao lầu Thanh và bánh bao bánh vạc Bông Hồng Trắng.'
          },
          {
            day: 'Ngày 2: Trải nghiệm Làng rau Trà Quế - Múa thúng Rừng dừa Bảy Mẫu',
            morning: 'Đạp xe xuyên đồng lúa đến Làng rau sạch Trà Quế 300 năm. Học cách làm nông dân xới đất, tưới rau bằng hai gáo nước và học làm bánh xèo miền Trung.',
            afternoon: 'Đến Rừng dừa nước Bảy Mẫu Cẩm Thanh. Ngồi thuyền thúng len lỏi giữa rặng dừa, xem nghệ nhân biểu diễn quay thúng chai cảm giác mạnh.',
            evening: 'Thưởng thức Cơm gà Bà Buội hoặc Cơm gà Nga. Thưởng thức show diễn nghệ thuật thực cảnh đẳng cấp “Ký Ức Hội An”.'
          },
          {
            day: 'Ngày 3: Bãi biển An Bàng & Thư thái cafe ngắm sông Hoài',
            morning: 'Đón bình minh tại Bãi biển An Bàng tĩnh lặng, nhâm nhi cafe dừa tại các quán cafe phong cách mộc ven biển.',
            afternoon: 'Tham gia lớp học làm đèn lồng thủ công tự tay bọc lụa tơ tằm. Mua bánh đậu xanh nhân thịt và lụa Hội An làm quà lưu niệm.'
          }
        ]
      }
    },
    food: [
      { name: 'Cao lầu Hội An gia truyền', desc: 'Sợi mì cao lầu ngâm tro củi Cù Lao Chàm thơm dẻo, xá xíu đậm đà, tóp mỡ giòn rụm và rau đắng Trà Quế (Cao lầu Thanh, Bá Lễ).' },
      { name: 'Cơm gà phố cổ vàng ươm', desc: 'Hạt cơm nấu nước luộc gà óng vàng thơm béo, thịt gà ta xé phay bóp gỏi hành tây rau răm chua ngọt (Bà Buội, Nga, Xí).' },
      { name: 'Bánh mì Hội An nức tiếng thế giới', desc: 'Bánh mì giòn rụm kẹp pate gan béo ngậy, thịt xíu, chả lụa và nước sốt bí truyền (Bánh mì Phượng, Madam Khánh).' },
      { name: 'Bánh đập hến xào Cẩm Nam & Nước Mót', desc: 'Bánh tráng nướng đập dập kẹp bánh ướt chấm mắm nêm, hến xào sa tế thơm cay và trà thảo mộc Mót phố Trần Phú.' }
    ],
    bestSeasons: [
      { time: 'Tháng 2 - Tháng 7 (Mùa khô ráo, nắng vàng đẹp)', highlight: 'Tiết trời ấm áp, nắng trong veo thích hợp đi bộ phố cổ và tắm biển An Bàng.' },
      { time: 'Đêm rằm 14 âm lịch hàng tháng', highlight: 'Đêm hội phố cổ: tắt hết đèn điện, thắp sáng hàng vạn chiếc đèn lồng hoa sen lung linh huyền ảo.' }
    ],
    cultureAndSpots: [
      'Đêm rằm hoa đăng sông Hoài: Nét đẹp văn hóa tâm linh lãng mạn bậc nhất di sản miền Trung.',
      'Làng nghề đèn lồng thủ công: Tự tay uốn nan tre, bọc vải lụa tơ tằm nguyên bản.',
      'Làng rau Trà Quế & Rừng dừa Bảy Mẫu: Nét văn hóa nông - ngư nghiệp mộc mạc trù phú của vùng đồng bằng xứ Quảng.'
    ]
  },

  phuquoc: {
    name: 'Phú Quốc (Kiên Giang)',
    tagline: 'Thiên đường ngọc bích miền nhiệt đới phương Nam',
    hotel: {
      id: 'hotel-phuquoc',
      name: 'Aura Phu Quoc Emerald Island',
      priceFrom: '3.200.000đ/đêm',
      highlight: 'Bãi Dài cát trắng mịn 800m, biệt thự hồ bơi riêng biệt lập, rạp chiếu phim bãi biển dưới trời sao, du thuyền ngắm hoàng hôn'
    },
    itineraries: {
      '3n2d': {
        title: 'Lịch trình 3 Ngày 2 Đêm: Lặn Ngắm San Hô, Sao Biển Rạch Vẹm & Cáp Treo Vượt Biển',
        days: [
          {
            day: 'Ngày 1: Đặt chân đến Đảo Ngọc - Hoàng hôn Dinh Cậu & Chợ đêm',
            morning: 'Đáp máy bay xuống Phú Quốc, xe đưa về resort Bãi Dài thư giãn nhận phòng.',
            afternoon: 'Tắm biển Bãi Dài làn nước xanh màu ngọc bích, ngắm hoàng hôn ngũ sắc tuyệt mỹ trên vịnh Thái Lan.',
            evening: 'Khám phá Chợ đêm Phú Quốc, thưởng thức Bún quậy Kiến Xây tự pha nước chấm, gỏi cá trích cuốn bánh tráng rau rừng và hải sản tươi sống.'
          },
          {
            day: 'Ngày 2: Tour Cano 4 Đảo Nam Đảo & Cáp treo Hòn Thơm kỷ lục',
            morning: 'Lên cano cao tốc khám phá Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút. Trải nghiệm lặn ngắm những rạn san hô tự nhiên đa sắc màu.',
            afternoon: 'Trải nghiệm Cáp treo Hòn Thơm - tuyến cáp treo vượt biển dài nhất thế giới ngắm toàn cảnh cảng biển An Thới. Vui chơi công viên nước Aquatopia.',
            evening: 'Dùng bữa tối hải sản nướng mỡ hành bên bờ biển lộng gió, xem phim ngoài trời dưới ngàn vì sao tại resort.'
          },
          {
            day: 'Ngày 3: Khám phá Vương quốc Sao Biển Rạch Vẹm Bắc Đảo',
            morning: 'Ghé Làng chài Rạch Vẹm hoang sơ, đi cầu gỗ ra các nhà bè ngắm hàng trăm cá thể sao biển đỏ rực dưới làn nước trong vắt.',
            afternoon: 'Ghé thăm vườn tiêu Suối Đá cay thơm trĩu quả và xưởng sản xuất nước mắm truyền thống trước khi ra sân bay.'
          }
        ]
      }
    },
    food: [
      { name: 'Gỏi cá trích cuốn bánh tráng rau rừng', desc: 'Thịt cá trích tươi sống nhúng giấm ổi, cuốn cùng dừa nạo, rau rừng đọt cóc đọt xoài chấm nước mắm nhĩ Phú Quốc đặc sánh đậu phộng.' },
      { name: 'Bún quậy Kiến Xây trứ danh', desc: 'Chả cá, chả tôm tươi giã quậy đều trong tô nước dùng sôi sùng sục, thực khách tự tay pha chế bát nước chấm muối ớt quất thơm nồng.' },
      { name: 'Nhum biển nướng mỡ hành & Ghẹ Hàm Ninh', desc: 'Nhum biển (cầu gai) nướng than béo ngậy thơm nức; ghẹ Hàm Ninh tuy nhỏ nhưng thịt săn chắc ngọt đậm đà.' },
      { name: 'Còi biên mai nướng muối ớt & Rượu sim rừng', desc: 'Còi biên mai giòn dai cay nồng nhấp cùng ly rượu sim rừng thơm mát hỗ trợ tiêu hóa tuyệt vời.' }
    ],
    bestSeasons: [
      { time: 'Tháng 11 - Tháng 4 (Mùa khô tuyệt mỹ)', highlight: 'Biển êm ả như mặt hồ, nước biển xanh trong thấu đáy, không mưa bão, hoàn hảo tuyệt đối cho tắm biển và lặn san hô.' },
      { time: 'Tháng 5 - Tháng 10 (Mùa mưa nhiệt đới)', highlight: 'Thời điểm thích hợp cho nghỉ dưỡng tĩnh lặng, các con suối Tranh, suối Đá Bàn tuôn chảy tuyệt đẹp.' }
    ],
    cultureAndSpots: [
      'Làng chài Rạch Vẹm & Mũi Gành Dầu: Điểm ngắm sao biển đỏ và ngắm hải giới biên cương hoang sơ.',
      'Nghề sản xuất nước mắm truyền thống Phú Quốc: Thùng gỗ bời lời ủ chượp cá cơm than trên 12 tháng.',
      'Cáp treo Hòn Thơm & Quần đảo An Thới: Thiên đường lặn biển ngắm rạn san hô đẹp bậc nhất Việt Nam.'
    ]
  },

  dalat: {
    name: 'Đà Lạt (Lâm Đồng)',
    tagline: 'Dinh thự phong cách Indochine Pháp bên Hồ Tuyền Lâm mộng mơ',
    hotel: {
      id: 'hotel-dalat',
      name: 'Aura Dalat Pine Forest Manor',
      priceFrom: '2.300.000đ/đêm',
      highlight: 'Bên hồ Tuyền Lâm, dinh thự cổ điển giữa rừng thông già, lò sưởi hơi nước ấm áp, chèo SUP ngắm sương mai, tiệc trà chiều Pháp'
    },
    itineraries: {
      '3n2d': {
        title: 'Lịch trình 3 Ngày 2 Đêm: Săn Mây Cầu Đất, Chèo SUP Tuyền Lâm & Ẩm Thực Phố Lạnh',
        days: [
          {
            day: 'Ngày 1: Chạm ngõ thành phố ngàn hoa - Hồ Xuân Hương & Dinh Bảo Đại',
            morning: 'Đến Đà Lạt, hít hà không khí se lạnh trong lành. Check-in Quảng trường Lâm Viên (Bông hoa Atiso & Dã quỳ khổng lồ).',
            afternoon: 'Thăm Ga Đà Lạt cổ kính với đầu tàu hơi nước răng cưa, dạo bước qua Dinh I / Dinh III Bảo Đại rợp bóng thông xanh.',
            evening: 'Thưởng thức Lẩu bò Ba Toa quán Gỗ thơm nức, dạo Chợ đêm Đà Lạt thưởng thức bánh tráng nướng giòn rụm và uống ly sữa đậu nành nóng hổi.'
          },
          {
            day: 'Ngày 2: Săn mây Đồi chè Cầu Đất 5h sáng - Chèo SUP Hồ Tuyền Lâm',
            morning: '5h00 sáng khởi hành đi Cầu Đất. Đứng trên thảm gỗ ngắm biển mây cuồn cuộn đón những tia nắng đầu ngày qua đồi chè trăm tuổi.',
            afternoon: 'Chèo thuyền Kayak hoặc SUP lướt trên mặt hồ Tuyền Lâm phẳng lặng như gương soi, len lỏi qua những rặng thông già cổ thụ.',
            evening: 'Thưởng thức Lẩu gà lá é Tao Ngộ cay the ấm nồng, nhâm nhi ly rượu vang Đà Lạt ủ thùng sồi bên lò sưởi ấm cúng.'
          },
          {
            day: 'Ngày 3: Vườn dâu tây & Cẩm tú cầu - Mua quà nông sản Đà Lạt',
            morning: 'Tự tay hái những trái dâu tây giống Nhật chín mọng tại vườn công nghệ cao, check-in cánh đồng hoa Cẩm tú cầu rực rỡ.',
            afternoon: 'Ghé tiệm mứt chọn mua Atiso tươi, hồng treo gió công nghệ Nhật Bản và hạt macca trước khi rời phố núi.'
          }
        ]
      }
    },
    food: [
      { name: 'Lẩu gà lá é Tao Ngộ', desc: 'Thịt gà đồi dai ngọt, nấm sò giòn sần sật nhúng cùng lá é the mát tạo nên vị chua thanh thơm lừng khó quên đường 3/4.' },
      { name: 'Bánh tráng nướng Dì Đinh (Pizza Đà Lạt)', desc: 'Bánh tráng giòn rụm nướng mỡ hành, trứng cút, xúc xích, phô mai béo ngậy chấm sốt me cay xé lưỡi.' },
      { name: 'Lẩu bò Ba Toa quán Gỗ', desc: 'Nồi lẩu bò đầy đặn đuôi bò, nạm bò hầm nhừ thơm mùi quế hồi ăn kèm mì trứng và rau tần ô tươi non.' },
      { name: 'Kem bơ Thanh Thảo & Bánh mì xíu mại chén', desc: 'Kem bơ béo ngậy ăn cùng viên kem dừa mát lạnh; bánh mì giòn tan chấm bát nước súp xíu mại đậm đà thơm ngậy.' }
    ],
    bestSeasons: [
      { time: 'Tháng 10 - Tháng 12 (Mùa hoa dã quỳ & săn mây cỏ hồng)', highlight: 'Sắc vàng rực của hoa dã quỳ trên mọi triền đồi, đồi cỏ hồng đẹp như tranh vẽ lúc bình minh.' },
      { time: 'Tháng 1 - Tháng 3 (Mùa hoa mai anh đào nở rộ)', highlight: 'Cả thành phố ngập trong sắc hồng phớt lãng mạn của hoa mai anh đào bên hồ Xuân Hương và dốc Đa Quý.' }
    ],
    cultureAndSpots: [
      'Hồ Tuyền Lâm & Thiền Viện Trúc Lâm: Không gian thiền tịnh tĩnh tại giữa rừng thông nguyên sinh bạt ngàn.',
      'Đồi chè Cầu Đất: Di sản nông nghiệp gần 100 năm của người Pháp trên cao nguyên Lâm Viên.',
      'Văn hóa uống sữa đậu nành nóng & ngắm phố lạnh về đêm: Trải nghiệm thi vị không thể thiếu của du khách khi đến Đà Lạt.'
    ]
  },

  ninhbinh: {
    name: 'Ninh Bình',
    tagline: 'Tuyệt tác nghỉ dưỡng sinh thái trong thung lũng di sản Tràng An',
    hotel: {
      id: 'hotel-ninhbinh',
      name: 'Aura Ninh Binh Karst Valley',
      priceFrom: '2.600.000đ/đêm',
      highlight: 'Thung lũng Tràng An & Tam Cốc, hồ bơi sinh thái giữa vách núi, bến thuyền riêng, ẩm thực dê núi nướng tảng'
    },
    itineraries: {
      '2n1d': {
        title: 'Lịch trình 2 Ngày 1 Đêm: Chèo Thuyền Tràng An, Chinh Phục Hang Múa & Chùa Bái Đính',
        days: [
          {
            day: 'Ngày 1: Quần thể Danh thắng Tràng An - Hoàng hôn Đỉnh Hang Múa',
            morning: 'Đến Ninh Bình. Ngồi thuyền nan xuôi dòng Sào Khê khám phá Quần thể Tràng An - luồn qua Hang Sáng, Hang Tối, viếng Hành cung Vũ Lâm thời Trần.',
            afternoon: 'Chinh phục 486 bậc đá Hang Múa. Đặt chân lên Đỉnh Ngọa Long ngắm toàn cảnh thung lũng Tam Cốc uốn lượn và cánh đồng lúa xanh ngát.',
            evening: 'Thưởng thức đại tiệc Thịt dê núi nướng tảng thơm lừng chấm tương gừng và Cơm cháy Ninh Bình giòn tan sốt tim cật béo ngậy.'
          },
          {
            day: 'Ngày 2: Chùa Bái Đính kỷ lục - Cố đô Hoa Lư lịch sử',
            morning: 'Chiêm bái Quần thể Tâm linh Chùa Bái Đính với tượng Phật bằng đồng dát vàng lớn nhất châu Á, hành lang 500 vị La Hán bằng đá xanh.',
            afternoon: 'Thăm Cố đô Hoa Lư - đền thờ Vua Đinh Tiên Hoàng và Vua Lê Đại Hành cổ kính rêu phong. Mua nem Yên Mạc và rượu Kim Sơn làm quà.'
          }
        ]
      }
    },
    food: [
      { name: 'Thịt dê núi Ninh Bình 7 món', desc: 'Dê leo núi đá vôi nên thịt săn chắc, thơm ngọt, không bị hôi. Các món nổi bật: Dê tái chanh kẹp chuối xanh, dê nướng tảng, dê xào lăn lăn sả ớt.' },
      { name: 'Cơm cháy sốt tim cật dê', desc: 'Cơm cháy chiên vàng giòn rụm, rưới nước sốt tim cật dê nóng hổi béo ngậy thơm ngọt đậm đà.' },
      { name: 'Ốc núi đá luộc sả & Nem chua Yên Mạc', desc: 'Ốc núi chỉ xuất hiện mùa mưa ăn lá cây thuốc nên thơm giòn sần sật; nem Yên Mạc gói lá ổi chấm nước mắm tỏi ớt.' }
    ],
    bestSeasons: [
      { time: 'Tháng 1 - Tháng 3 (Mùa lễ hội xuân tâm linh)', highlight: 'Tiết trời xuân mát mẻ, vạn vật đâm chồi, trẩy hội cầu an tại chùa Bái Đính và Tràng An.' },
      { time: 'Tháng 5 - Tháng 6 (Mùa lúa chín vàng Tam Cốc)', highlight: 'Những cánh đồng lúa chín vàng óng ánh hai bên dòng sông Ngô Đồng tạo nên bức tranh thủy mặc ngoạn mục.' },
      { time: 'Tháng 6 - Tháng 8 (Mùa hoa sen nở ngát thung lũng)', highlight: 'Hoa sen, hoa súng nở rộ kín mặt nước đầm Vân Long và chân núi Hang Múa.' }
    ],
    cultureAndSpots: [
      'Quần thể Danh thắng Tràng An: Di sản Thế giới Kép đầu tiên và duy nhất tại Đông Nam Á (Văn hóa & Thiên nhiên).',
      'Đỉnh Ngọa Long - Hang Múa: Điểm ngắm toàn cảnh cố đô ngoạn mục nhất được ví như “Vạn Lý Trường Thành” thu nhỏ.',
      'Cố đô Hoa Lư: Kinh đô đầu tiên của nhà nước phong kiến tập quyền Việt Nam thế kỷ thứ 10.'
    ]
  },

  halong: {
    name: 'Vịnh Hạ Long (Quảng Ninh)',
    tagline: 'Kỳ quan thiên nhiên thế giới nghìn năm huyền tích',
    hotel: {
      id: 'hotel-halong',
      name: 'Aura Ha Long Heritage Bay',
      priceFrom: '2.750.000đ/đêm',
      highlight: 'Toàn cảnh Vịnh Hạ Long, du thuyền riêng ngắm hoàng hôn, tiệc hải sản Michelin, hồ bơi vô cực sát vách đá'
    },
    itineraries: {
      '2n1d': {
        title: 'Lịch trình 2 Ngày 1 Đêm: Du Thuyền Kỳ Quan Vịnh, Hang Sửng Sốt & Đảo Ti Tốp',
        days: [
          {
            day: 'Ngày 1: Lên du thuyền ra khơi - Hang Sửng Sốt & Chèo Kayak',
            morning: 'Lên du thuyền xuất bến Tuần Châu, thưởng thức bữa trưa hải sản tươi sống trong khi tàu lướt qua hàng nghìn đảo đá vôi kỳ vĩ.',
            afternoon: 'Khám phá Hang Sửng Sốt với hệ thống nhũ đá khổng lồ lung linh huyền thoại. Chèo thuyền Kayak len lỏi qua Hang Luồn ngắm đàn khỉ hoang dã.',
            evening: 'Tắm biển trên Đảo Ti Tốp, leo 400 bậc đá ngắm toàn cảnh vịnh 360 độ lúc hoàng hôn rực rỡ. Tiệc tối hải sản và câu mực đêm trên boong tàu.'
          },
          {
            day: 'Ngày 2: Bình minh vịnh biển - Bảo tàng Quảng Ninh & Chợ hải sản',
            morning: 'Đón bình minh trong lành trên boong tàu, tập Thái Cực Quyền (Tai Chi). Thưởng thức bữa sáng buffet nhẹ.',
            afternoon: 'Trở lại đất liền, check-in Bảo tàng Quảng Ninh độc đáo màu đen huyền bí. Mua Chả mực giã tay Bãi Cháy nóng hổi làm quà.'
          }
        ]
      }
    },
    food: [
      { name: 'Chả mực giã tay Bãi Cháy', desc: 'Mực mai tươi giã tay thủ công, chiên vàng ươm giòn sần sật, ăn cùng xôi trắng hoặc bánh cuốn nóng hổi.' },
      { name: 'Sá sùng xào tỏi & Canh sá sùng', desc: 'Đặc sản quý hiếm của vùng biển đảo Quan Lạn, vị ngọt thanh tự nhiên đậm đà không loại gia vị nào sánh được.' },
      { name: 'Sam biển 7 món & Bún bề bề', desc: 'Thịt sam biển nướng mỡ hành, xào chua ngọt; bát bún bề bề thơm lừng nước dùng tôm ngọt lịm.' }
    ],
    bestSeasons: [
      { time: 'Tháng 4 - Tháng 6 & Tháng 9 - Tháng 11', highlight: 'Thời tiết nắng vàng ươm, biển êm sóng lặng, trời trong xanh không sương mù, lý tưởng tuyệt đối để đi du thuyền và chèo kayak.' }
    ],
    cultureAndSpots: [
      'Kỳ quan Vịnh Hạ Long: Di sản Thiên nhiên Thế giới 2 lần được UNESCO công nhận.',
      'Làng chài cổ Cửa Vạn: Nét văn hóa nhà bè mộc mạc của ngư dân ngàn đời gắn bó với biển cả.'
    ]
  },

  hue: {
    name: 'Cố Đô Huế',
    tagline: 'Lắng đọng nét xưa cung đình bên dòng sông Hương thơ mộng',
    hotel: {
      id: 'hotel-hue',
      name: 'Aura Hue Imperial Riverside',
      priceFrom: '1.950.000đ/đêm',
      highlight: 'Bên bờ sông Hương, view cầu Trường Tiền, thuyền rồng hoàng gia đưa rước, trà chiều Nhã nhạc cung đình'
    },
    itineraries: {
      '2n1d': {
        title: 'Lịch trình 2 Ngày 1 Đêm: Hoàng Thành Đại Nội, Lăng Tẩm Cổ Kính & Ca Huế Sông Hương',
        days: [
          {
            day: 'Ngày 1: Quần thể Hoàng Cung Đại Nội - Thuyền rồng nghe Ca Huế',
            morning: 'Thăm Đại Nội Huế: Ngọ Môn tráng lệ, Điện Thái Hòa, Tử Cấm Thành và các cung đình triều Nguyễn nguy nga.',
            afternoon: 'Viếng Chùa Thiên Mụ 400 năm tuổi soi bóng sông Hương. Thưởng thức bánh bèo, nậm, lọc mộc mạc và chè hẻm 20 món.',
            evening: 'Lên thuyền rồng du ngoạn sông Hương, nghe những làn điệu Ca Huế mượt mà và thả hoa đăng giấy cầu may mắn khi cầu Trường Tiền lên đèn rực rỡ.'
          },
          {
            day: 'Ngày 2: Lăng Khải Định lộng lẫy - Chợ Đông Ba mua đặc sản',
            morning: 'Khám phá Lăng Khải Định - đỉnh cao nghệ thuật khảm sành sứ Tây - Á kết hợp, hoặc viếng Lăng Tự Đức thơ mộng như một bức tranh sơn thủy.',
            afternoon: 'Dạo Chợ Đông Ba thưởng thức tô Bún bò Huế chuẩn vị thơm nồng mắm ruốc, mua kẹo mè xửng, tôm chua và nón bài thơ làm quà.'
          }
        ]
      }
    },
    food: [
      { name: 'Bún bò Huế chuẩn vị cố đô', desc: 'Nước dùng ninh từ xương bò và sả thơm ngào ngạt mùi mắm ruốc đặc trưng, ăn cùng chả cua, tiết luộc và bắp bò mềm ngọt.' },
      { name: 'Cơm hến & Bún hến cồn Hến', desc: 'Thịt hến nhỏ ngọt bùi xào măng ớt, tóp mỡ giòn cay, bắp chuối thái mỏng ăn cùng chén nước luộc hến nóng hổi thơm nồng.' },
      { name: 'Bánh bèo, bánh nậm, bánh bột lọc', desc: 'Bánh bèo chén rắc tôm chấy, bánh lọc nhân tôm thịt trong veo dai dai chấm nước mắm ớt xanh cay xé.' },
      { name: 'Chè hẻm 20 món & Chè bột lọc bọc heo quay', desc: 'Món chè độc nhất vô nhị với viên bột lọc bọc thịt heo quay mặn ngọt hòa quyện ăn cùng nước đường phèn gừng ấm áp.' }
    ],
    bestSeasons: [
      { time: 'Tháng 1 - Tháng 4 (Mùa xuân cố đô dịu dàng)', highlight: 'Tiết trời mát mẻ, nắng nhẹ, ngàn hoa đua nở, thích hợp diện áo dài cổ phục chụp ảnh tại các lăng tẩm hoàng cung.' }
    ],
    cultureAndSpots: [
      'Đại Nội & Hệ thống Lăng tẩm triều Nguyễn: Di sản Văn hóa Thế giới bảo tồn nguyên vẹn kiến trúc cung đình phong kiến phương Đông.',
      'Nhã nhạc Cung đình Huế & Ca Huế Sông Hương: Di sản Văn hóa Phi vật thể đại diện của nhân loại.',
      'Nghệ thuật ẩm thực Cung đình và Dân gian Huế: Đỉnh cao tinh tế trong cách bài trí và hương vị ngũ hành.'
    ]
  }
};

/**
 * Intelligent NLP Intent Analyzer
 */
export function analyzeUserQuery(message) {
  const text = (message || '').toLowerCase().trim();

  // 1. Detect Destination
  let destination = null;
  if (/đà nẵng|danang|mỹ khê|sơn trà|ngũ hành sơn|cầu rồng|bà nà/.test(text)) destination = 'danang';
  else if (/sa pa|sapa|mường hoa|fansipan|cát cát|tả van|ô quy hồ|tả phìn/.test(text)) destination = 'sapa';
  else if (/hội an|hoian|sông hoài|phố cổ|trà quế|cẩm nam|chùa cầu|rừng dừa|bảy mẫu/.test(text)) destination = 'hoian';
  else if (/phú quốc|phu quoc|bãi dài|rạch vẹm|hòn thơm|an thới|sao biển|bãi sao/.test(text)) destination = 'phuquoc';
  else if (/đà lạt|dalat|tuyền lâm|cầu đất|hồ tuyền lâm|đồi chè|hoa dã quỳ|mai anh đào/.test(text)) destination = 'dalat';
  else if (/ninh bình|ninh binh|tràng an|tam cốc|bích động|hang múa|bái đính|hoa lư|đầm vân long/.test(text)) destination = 'ninhbinh';
  else if (/hạ long|ha long|vịnh hạ long|bãi cháy|hang sửng sốt|ti tốp|tuần châu/.test(text)) destination = 'halong';
  else if (/huế|hue|sông hương|hương giang|trường tiền|đại nội|khải định|tự đức|thiên mụ/.test(text)) destination = 'hue';

  // 2. Detect Intent
  let intent = 'general';

  if (/gia đình|trẻ em|con nhỏ|người lớn tuổi|bố mẹ|người già|em bé/.test(text)) {
    intent = 'family';
  } else if (/cặp đôi|người yêu|trăng mật|honeymoon|lãng mạn|hai người/.test(text)) {
    intent = 'couple';
  } else if (/lịch trình|kế hoạch|gợi ý đi|tour|hành trình|mấy ngày|ngày 1|ngày 2|3 ngày|2 ngày|1 ngày|4 ngày|3n2đ|2n1đ|nên đi đâu trước|lịch trình chi tiết/.test(text)) {
    intent = 'itinerary';
  } else if (/ăn gì|quán ăn|món ngon|đặc sản|ẩm thực|ăn uống|quán nào|chợ đêm|uống gì|món ăn|bún|hải sản|lẩu|bánh mì|cao lầu|chè/.test(text)) {
    intent = 'food';
  } else if (/thời tiết|mùa nào|tháng mấy|mùa đẹp|mưa hay nắng|khi nào nên đi|nhiệt độ|trang phục|mặc gì|săn mây vào tháng/.test(text)) {
    intent = 'weather';
  } else if (/điểm tham quan|chơi gì|đi đâu chơi|danh thắng|check-?in|cảnh đẹp|sống ảo|điểm du lịch|có gì chơi|chùa|núi|hang động|vịnh/.test(text)) {
    intent = 'attractions';
  } else if (/văn hóa|văn hoá|bản địa|truyền thống|làng nghề|tắm lá|hoa đăng|múa thúng|dệt vải|thổ cẩm|lễ hội|tập tục/.test(text)) {
    intent = 'culture';
  } else if (/kinh nghiệm|di chuyển|đi lại|thuê xe|xe máy|taxi|máy bay|tàu hỏa|tàu hoả|lưu ý|chuẩn bị/.test(text)) {
    intent = 'transport_tips';
  } else if (/chi phí|kinh phí|bao nhiêu tiền|tiết kiệm|ngân sách/.test(text)) {
    intent = 'budget';
  } else if (/giá phòng|đặt phòng|thuê phòng|hạng phòng|suite|deluxe|villa|resort có gì|tiện nghi phòng|còn phòng/.test(text)) {
    intent = 'room_booking';
  } else if (/thanh toán|vnpay|momo|chuyển khoản|vietqr|thẻ/.test(text)) {
    intent = 'payment';
  } else if (/khuyến mãi|ưu đãi|voucher|mã giảm|giảm giá|hội viên|loyalty/.test(text)) {
    intent = 'promotion';
  }

  return { intent, destination, originalQuery: message };
}

/**
 * Synthesizes intelligent travel advice when offline or as live AI baseline
 */
export function generateTravelAdvice({ intent, destination, originalQuery }) {
  const dest = destination ? DESTINATION_DATA[destination] : null;

  // Case 1: Specific Destination Itinerary
  if (intent === 'itinerary' && dest) {
    const itinerary = dest.itineraries['3n2d'] || dest.itineraries['2n1d'];
    let text = `🗺️ **${itinerary.title}** (${dest.name})\n\n`;
    text += `*Chào quý khách! Dưới đây là lịch trình tối ưu được thiết kế khoa học giúp quý khách trải nghiệm trọn vẹn cảnh sắc, ẩm thực và văn hóa:* \n\n`;

    itinerary.days.forEach(d => {
      text += `📅 **${d.day}**\n`;
      if (d.morning) text += `• **Buổi sáng:** ${d.morning}\n`;
      if (d.afternoon) text += `• **Buổi chiều:** ${d.afternoon}\n`;
      if (d.evening) text += `• **Buổi tối:** ${d.evening}\n`;
      text += `\n`;
    });

    text += `💡 **Gợi ý lưu trú & Dịch vụ đồng hành:**\n`;
    text += `Để thuận tiện di chuyển trong lịch trình này, quý khách có thể lựa chọn nghỉ dưỡng tại **${dest.hotel.name}** (${dest.hotel.highlight}).\n\n`;
    text += `Quý khách có cần em điều chỉnh thời gian, gợi ý thêm quán ăn hay hỗ trợ đặt phòng không ạ?`;
    return text;
  }

  // Case 2: Cross-destination / General Itinerary Request
  if (intent === 'itinerary' && !dest) {
    return `🗺️ **Gợi Ý 3 Cung Đường Du Lịch Văn Hóa 3 Ngày 2 Đêm Tuyệt Đẹp Tại Việt Nam:**\n\n` +
      `**1. Cung Đường Di Sản Miền Trung: Đà Nẵng - Hội An (Biển xanh & Phố Cổ Hoa Đăng)**\n` +
      `• **Ngày 1:** Tắm biển Mỹ Khê, ngắm Voọc Bán đảo Sơn Trà, xem Cầu Rồng phun lửa.\n` +
      `• **Ngày 2:** Khám phá Ngũ Hành Sơn, dạo phố cổ Hội An, thả hoa đăng sông Hoài.\n` +
      `• **Ngày 3:** Đạp xe Làng rau Trà Quế, múa thúng Rừng Dừa Bảy Mẫu, thưởng thức Cao Lầu & Cơm gà.\n\n` +
      `**2. Cung Đường Mây Ngàn Tây Bắc: Sa Pa (Chinh phục Fansipan & Bản sắc vùng cao)**\n` +
      `• **Ngày 1:** Săn mây Mường Hoa, trekking bản Cát Cát, ăn lẩu cá tầm.\n` +
      `• **Ngày 2:** Chinh phục nóc nhà Đông Dương Fansipan 3.143m, tắm bồn lá thuốc Dao Đỏ.\n` +
      `• **Ngày 3:** Ngoạn cảnh Đèo Ô Quy Hồ, thưởng thức đồ nướng than củi Tây Bắc.\n\n` +
      `**3. Cung Đường Non Nước Tràng An: Ninh Bình (Di sản thế giới kép)**\n` +
      `• **Ngày 1:** Thuyền nan Tràng An len qua hang đá, ngắm hoàng hôn đỉnh Hang Múa.\n` +
      `• **Ngày 2:** Viếng Chùa Bái Đính nguy nga, thưởng thức Dê núi nướng tảng & cơm cháy.\n\n` +
      `✨ *Quý khách yêu thích cung đường biển, vùng cao hay danh thắng sông nước nào nhất? Nhắn cho em để em lên kế hoạch chi tiết từng giờ giúp mình nhé!*`;
  }

  // Case 3: Food & Gastronomy
  if (intent === 'food') {
    if (dest) {
      let text = `🍜 **Bản Đồ Ẩm Thực Đặc Sản Không Thể Bỏ Lỡ Tại ${dest.name}:**\n\n`;
      dest.food.forEach((f, i) => {
        text += `**${i + 1}. ${f.name}**\n• ${f.desc}\n\n`;
      });
      text += `🥢 *Mẹo thưởng thức:* Hãy ghé các quán ăn mộc mạc của người bản địa hoặc chợ đêm địa phương để cảm nhận chuẩn xác nhất hương vị nguyên bản quý khách nhé!`;
      return text;
    } else {
      return `🍜 **Tinh Hoa Ẩm Thực 3 Miền Tại Các Điểm Đến Nổi Tiếng:**\n\n` +
        `• **Sa Pa:** Lẩu cá tầm nước trong béo ngọt, thắng cố A Quỳnh, lợn cắp nách nướng than, hạt dẻ nướng bơ.\n` +
        `• **Đà Nẵng:** Bánh tráng cuốn thịt heo Đại Lộc mắm nêm, mì Quảng ếch Bếp Trang, hải sản Bé Mặn, chè sầu Liên.\n` +
        `• **Hội An:** Cao lầu Bá Lễ, cơm gà Bà Buội, bánh mì Phượng kẹp thịt xíu giòn rụm, nước Mót thảo mộc hoa sen.\n` +
        `• **Phú Quốc:** Gỏi cá trích tươi nhúng giấm cuốn bánh tráng, bún quậy Kiến Xây, nhum biển nướng mỡ hành.\n` +
        `• **Ninh Bình:** Dê núi nướng tảng, cơm cháy giòn rụm chấm nước sốt tim cật, ốc núi đá luộc sả.\n` +
        `• **Đà Lạt:** Lẩu gà lá é Tao Ngộ, bánh tráng nướng Dì Đinh, lẩu bò Ba Toa, kem bơ Thanh Thảo.\n\n` +
        `Quý khách đang chuẩn bị đi điểm đến nào? Hãy nhắn tên thành phố để em gửi danh sách địa chỉ quán ngon cụ thể kèm tọa độ nhé!`;
    }
  }

  // Case 4: Weather & Timing
  if (intent === 'weather') {
    if (dest) {
      let text = `☀️ **Cẩm Nang Thời Tiết & Mùa Đẹp Nhất Để Du Lịch ${dest.name}:**\n\n`;
      dest.bestSeasons.forEach(s => {
        text += `• **${s.time}:** ${s.highlight}\n\n`;
      });
      text += `🎒 **Trang phục gợi ý:**\n`;
      if (destination === 'sapa' || destination === 'dalat') {
        text += `Mang áo ấm, khăn choàng, áo khoác gió (buổi tối và sáng sớm nhiệt độ có thể xuống 10-15°C), giày thể thao/giày bệt êm chân để đi dạo thoải mái.`;
      } else if (destination === 'danang' || destination === 'phuquoc') {
        text += `Đồ bơi, váy maxi biển, kính râm, mũ rộng vành, kem chống nắng SPF50+ và dép cói/sandal nhẹ nhàng.`;
      } else {
        text += `Trang phục lịch sự khi viếng chùa chiền, đền đài (áo có tay, quần/váy qua đầu gối), nón lá/mũ che nắng và giày bệt di chuyển thuyền.`;
      }
      return text;
    } else {
      return `☀️ **Thời Điểm Vàng Du Lịch Các Vùng Miền Việt Nam:**\n\n` +
        `• **Du lịch Biển Đảo (Đà Nẵng, Hạ Long):** Đẹp nhất từ **tháng 3 đến tháng 8**, nắng vàng rực rỡ, sóng êm nước trong.\n` +
        `• **Phú Quốc (Biển Tây Nam):** Đẹp nhất từ **tháng 11 đến tháng 4**, mặt biển phẳng lặng ngọc bích, nắng ấm chan hòa.\n` +
        `• **Sa Pa (Vùng cao Tây Bắc):** Tháng 9-10 ngắm lúa chín vàng; Tháng 12-2 ngắm đào mận & săn tuyết mây; Tháng 4-5 mùa nước đổ.\n` +
        `• **Đà Lạt (Phố sương mờ):** Tháng 10-3 mùa hoa dã quỳ, mai anh đào và săn mây đồi chè se lạnh.\n` +
        `• **Ninh Bình:** Tháng 1-3 mùa lễ hội xuân; Tháng 5-6 mùa lúa chín vàng Tam Cốc.\n\n` +
        `Quý khách dự định đi vào tháng mấy ạ? Em sẽ tư vấn địa điểm có thời tiết lý tưởng nhất trong khoảng thời gian đó!`;
    }
  }

  // Case 5: Attractions & Culture
  if (intent === 'attractions' || intent === 'culture') {
    if (dest) {
      let text = `🌸 **Danh Thắng & Trải Nghiệm Bản Sắc Văn Hóa Độc Đáo Tại ${dest.name}:**\n\n`;
      dest.cultureAndSpots.forEach(s => {
        text += `• **${s.split(':')[0]}:** ${s.split(':').slice(1).join(':')}\n\n`;
      });
      text += `💡 *Gợi ý cho quý khách:* Khi lưu trú tại **${dest.hotel.name}**, quý khách sẽ được hỗ trợ xe đưa đón, hướng dẫn viên trải nghiệm và dịch vụ đặt vé ưu tiên!`;
      return text;
    } else {
      return `🌸 **Top Danh Lam Thắng Cảnh & Trải Nghiệm Văn Hóa Nổi Bật Việt Nam:**\n\n` +
        `• **Tây Bắc (Sa Pa):** Chinh phục Fansipan 3.143m, trekking bản Cát Cát, liệu pháp tắm lá thuốc cổ truyền người Dao Đỏ.\n` +
        `• **Miền Trung (Đà Nẵng - Hội An):** Ngắm Voọc Bán đảo Sơn Trà, Cầu Rồng phun lửa, thả hoa đăng trên sông Hoài, múa thúng Rừng dừa Bảy Mẫu.\n` +
        `• **Đảo Ngọc (Phú Quốc):** Vương quốc sao biển Rạch Vẹm, cáp treo Hòn Thơm vượt biển, lặn ngắm san hô Nam Đảo.\n` +
        `• **Vùng đất Di sản (Ninh Bình - Hạ Long):** Thuyền nan Tràng An, đỉnh núi Rồng Hang Múa, du thuyền kỳ quan Vịnh Hạ Long.\n` +
        `• **Cao nguyên thơ mộng (Đà Lạt):** Đồi chè Cầu Đất săn mây 5h sáng, chèo SUP Hồ Tuyền Lâm giữa rừng thông.\n` +
        `• **Cố đô Huế:** Hoàng thành Đại Nội, lăng Khải Định, nghe ca Huế trên sông Hương.\n\n` +
        `Quý khách mong muốn khám phá vùng miền nào để em gửi gợi ý chi tiết nhất ạ?`;
    }
  }

  // Case 6: Family with children / elderly
  if (intent === 'family') {
    return `👨‍👩‍👧‍👦 **Tư Vấn Du Lịch Thư Thái Cho Gia Đình Có Trẻ Nhỏ & Người Lớn Tuổi:**\n\n` +
      `**1. Điểm đến phù hợp hàng đầu: Đà Nẵng - Hội An**\n` +
      `• **Ưu điểm:** Đường sá bằng phẳng, xe đẩy di chuyển cực kỳ thuận lợi, bãi biển Mỹ Khê thoải và nông, hải sản tươi ngon, dịch vụ y tế và lưu trú cao cấp 5 sao.\n` +
      `• **Hoạt động gợi ý:** Tắm biển sớm, đi dạo phố cổ Hội An ngắm đèn lồng, tham quan Bà Nà Hills có cáp treo nhẹ nhàng không tốn sức.\n\n` +
      `**2. Lựa chọn nghỉ dưỡng biển đảo biệt lập: Phú Quốc**\n` +
      `• **Ưu điểm:** Không khí biển trong lành, trẻ em thỏa thích nghịch cát, người lớn tuổi tĩnh dưỡng giữa khuôn viên xanh mát, biệt thự có hồ bơi riêng tư.\n\n` +
      `**3. Vùng non nước thanh bình: Ninh Bình**\n` +
      `• **Ưu điểm:** Đi thuyền nan nhẹ nhàng ngắm cảnh non nước Tràng An, không khí làng quê thanh tịnh, ẩm thực thanh đạm bổ dưỡng.\n\n` +
      `💡 **Lưu ý chuẩn bị:**\n` +
      `• Tại chuỗi resort **AuraResort**, các bé luôn được miễn phí buffet sáng và hỗ trợ cũi trẻ em theo yêu cầu.\n\n` +
      `Quý khách dự kiến đi bao nhiêu người lớn và trẻ nhỏ ạ? Em sẽ tư vấn phân bổ phòng và lịch trình phù hợp nhất!`;
  }

  // Case 7: Couple / Honeymoon
  if (intent === 'couple') {
    return `💑 **Gợi Ý Điểm Đến Lãng Mạn Cho Cặp Đôi & Tuần Trăng Mật (Honeymoon):**\n\n` +
      `**1. Sa Pa - Mộng Mơ Giữa Biển Mây Hoàng Liên Sơn:**\n` +
      `• Cùng nhau ngắm sương mù sớm mai bên tách trà ấm, ngâm bồn gỗ thảo dược thơm ngát và sưởi ấm bên lò sưởi củi tại *Aura Sapa Misty Peak Retreat*.\n\n` +
      `**2. Hội An - Lắng Đọng Đêm Hoa Đăng Sông Hoài:**\n` +
      `• Nắm tay dạo bước dưới hàng ngàn chiếc đèn lồng huyền ảo, đi thuyền gỗ thả đèn hoa đăng gửi gắm ước nguyện bền lâu.\n\n` +
      `**3. Phú Quốc - Hoàng Hôn Ngũ Sắc & Biệt Thự Hồ Bơi Riêng:**\n` +
      `• Biệt thự biển riêng tư tại *Aura Phu Quoc Emerald Island*, rạp chiếu phim ngoài bãi biển dưới trời sao và tiệc tối hải sản lãng mạn.\n\n` +
      `Quý khách yêu thích phong cách se lạnh vùng cao hay biển đảo ấm áp để em chuẩn bị gói trang trí phòng trăng mật tặng thêm nhé!`;
  }

  // Case 8: Transport tips & preparation
  if (intent === 'transport_tips') {
    if (dest) {
      let specificTips = '';
      if (destination === 'sapa') {
        specificTips = `• **Đến Sa Pa:** Đi xe Limousine giường nằm từ Hà Nội (5-6 giờ qua cao tốc Nội Bài - Lào Cai) hoặc tàu hỏa đêm Hà Nội - Lào Cai rồi đi xe trung chuyển lên thị xã.\n` +
          `• **Đi lại tại Sa Pa:** Thuê xe máy (120k-150k/ngày) nếu vững tay lái đường đèo dốc; hoặc thuê xe ôm bản địa / xe điện dạo thị xã / xe Jeep đi bản Cát Cát, Tả Van.\n` +
          `• **Lưu ý:** Mang giày leo núi hoặc giày thể thao bám đường tốt; buổi tối sương xuống đường khá trơn.`;
      } else if (destination === 'danang') {
        specificTips = `• **Đến Đà Nẵng:** Sân bay Quốc tế Đà Nẵng nằm ngay giữa trung tâm thành phố, cách biển Mỹ Khê chỉ 10 phút đi taxi.\n` +
          `• **Đi lại tại Đà Nẵng:** Thuê xe máy giao tận nơi (100k-130k/ngày) hoặc đặt Grab Car/Bike giá rất hợp lý. Đi Hội An mất 35 phút bằng taxi hoặc bus.\n` +
          `• **Lưu ý:** Nếu đi Bà Nà Hills, nên mua vé cáp treo trước qua mạng để không phải xếp hàng tại quầy vé.`;
      } else if (destination === 'hoian') {
        specificTips = `• **Đến Hội An:** Từ sân bay Đà Nẵng đi taxi hoặc xe bus khoảng 30km (40 phút).\n` +
          `• **Đi lại tại Hội An:** Phố cổ cấm xe máy theo các khung giờ (09:00-11:00 và 15:00-21:30), phương tiện lý tưởng nhất là xe đạp dạo phố hoặc đi bộ.\n` +
          `• **Điểm lân cận:** Đi Rừng dừa Bảy Mẫu (5km) hoặc biển An Bàng (4km) bằng xe đạp hoặc taxi rất thuận tiện.`;
      } else if (destination === 'phuquoc') {
        specificTips = `• **Đến Phú Quốc:** Bay thẳng đến Cảng hàng không Quốc tế Phú Quốc (PQC) từ Hà Nội, TP.HCM, Hải Phòng, Cần Thơ...\n` +
          `• **Đi lại trên đảo:** Thuê xe máy (120k-150k/ngày) hoặc thuê ô tô tự lái (600k-900k/ngày) để khám phá Bắc Đảo (Rạch Vẹm) và Nam Đảo (An Thới).\n` +
          `• **Lưu ý lặn biển:** Khi đi cano 4 đảo nên chọn cano chuẩn du lịch có đầy đủ áo phao, kính lặn và ống thở; giữ gìn vệ sinh không chạm vào rạn san hô sống.`;
      } else if (destination === 'dalat') {
        specificTips = `• **Đến Đà Lạt:** Bay đến sân bay Liên Khương (cách trung tâm 30km, xe bus sân bay 40k-50k/lượt) hoặc xe khách giường nằm từ TP.HCM (6-8 tiếng).\n` +
          `• **Đi lại tại Đà Lạt:** Thuê xe máy số/tay ga (100k-150k/ngày). Đường Đà Lạt nhiều dốc và không có đèn giao thông, chú ý quan sát tại các bùng binh.\n` +
          `• **Săn mây Cầu Đất:** Nên xuất phát từ 4h30 - 5h00 sáng, trang bị áo khoác dày, găng tay vì sáng sớm nhiệt độ chỉ 12-14°C.`;
      } else if (destination === 'ninhbinh') {
        specificTips = `• **Đến Ninh Bình:** Cách Hà Nội 90km, đi xe Limousine 130k-150k đón trả tận nơi (khoảng 1 giờ 20 phút qua cao tốc Pháp Vân - Cầu Giẽ).\n` +
          `• **Đi lại tại Ninh Bình:** Thuê xe máy (100k-130k/ngày) hoặc xe đạp dạo quanh cánh đồng Tam Cốc rất thi vị.\n` +
          `• **Lưu ý đi thuyền:** Nên đi tuyến Tràng An lúc 7h00 - 8h00 sáng hoặc sau 14h00 chiều để tránh nắng gắt và dòng khách đông.`;
      }

      return `🚗 **Kinh Nghiệm Di Chuyển & Đi Lại Tại ${dest.name}:**\n\n` +
        specificTips + `\n\n` +
        `💡 *Đặc quyền:* Khách lưu trú tại **${dest.hotel.name}** được hỗ trợ xe đưa đón, hỗ trợ gọi xe và hướng dẫn viên nhiệt tình 24/7!`;
    }

    return `🚗 **Kinh Nghiệm Di Chuyển & Phương Tiện Du Lịch Thuận Tiện Nhất:**\n\n` +
      `• **Đà Nẵng & Hội An:** Sân bay quốc tế Đà Nẵng ngay trung tâm. Di chuyển trong phố bằng Grab hoặc thuê xe máy (120k-150k/ngày). Từ Đà Nẵng đi Hội An chỉ mất 35 phút bằng taxi hoặc xe bus du lịch.\n` +
      `• **Sa Pa:** Đi xe Limousine giường nằm từ Hà Nội (khoảng 5-6 giờ cao tốc) hoặc đi tàu hỏa đêm Hà Nội - Lào Cai. Tại Sa Pa thuê xe máy hoặc xe Jeep địa hình để dạo bản làng.\n` +
      `• **Phú Quốc:** Bay thẳng đến sân bay Phú Quốc (PQC). Khuyên dùng xe đưa đón resort hoặc thuê xe tự lái/xe máy vi vu quanh đảo.\n` +
      `• **Ninh Bình:** Cách Hà Nội chỉ 90 phút qua cao tốc. Thuê xe limousine đón tận nơi hoặc đi xe máy dạo qua các cánh đồng lúa Tam Cốc rất thi vị.\n\n` +
      `✨ *Hội viên Aura Loyalty Club được hỗ trợ dịch vụ đưa đón sân bay và xe riêng 24/7!*`;
  }

  // Case 9: Budget planning
  if (intent === 'budget') {
    if (dest) {
      return `💰 **Dự Toán Chi Phí Du Lịch 3 Ngày 2 Đêm Tại ${dest.name} (Cho 1 Người):**\n\n` +
        `• **Di chuyển (Vé máy bay / Limousine):** 600.000đ - 2.200.000đ (tùy xuất phát điểm và loại xe).\n` +
        `• **Lưu trú (2 đêm):** 1.200.000đ - 3.500.000đ (khách sạn 3-4 sao hoặc resort cao cấp 5 sao).\n` +
        `• **Ăn uống & Đặc sản bản địa:** 800.000đ - 1.500.000đ (thưởng thức trọn vẹn đặc sản vùng miền).\n` +
        `• **Vé tham quan & Trải nghiệm:** 500.000đ - 1.200.000đ (vé các danh thắng, thuyền nan, cáp treo...).\n` +
        `• **Tổng chi phí ước tính:** Khoảng **3.500.000đ - 7.000.000đ/người** cho một kỳ nghỉ thoải mái, trọn vẹn.\n\n` +
        `💡 *Mẹo tiết kiệm tại ${dest.name}:* Đặt phòng trước từ 2-3 tuần và áp dụng mã ưu đãi \`AURA15\` để tiết kiệm ngay 15% tổng hóa đơn phòng!`;
    }

    return `💰 **Dự Toán Chi Phí Du Lịch 3 Ngày 2 Đêm Tham Khảo (Cho 1 Người):**\n\n` +
      `• **Vé máy bay / Xe di chuyển:** 1.200.000đ - 2.500.000đ (tùy chặng bay và thời điểm đặt vé sớm).\n` +
      `• **Lưu trú nghỉ dưỡng:** 1.500.000đ - 3.500.000đ/2 đêm (tùy chọn phòng khách sạn tiêu chuẩn hay resort 5 sao).\n` +
      `• **Ăn uống & Đặc sản:** 800.000đ - 1.500.000đ (thưởng thức thoải mái đặc sản đường phố, hải sản tươi sống và cafe view đẹp).\n` +
      `• **Vé tham quan & Trải nghiệm:** 500.000đ - 1.200.000đ (vé cáp treo Fansipan / Bà Nà, vé thuyền Tràng An, thuyền thúng...).\n` +
      `• **Tổng ước tính:** Khoảng **4.000.000đ - 7.500.000đ/người** cho một chuyến đi 3N2Đ thoải mái, trọn vẹn.\n\n` +
      `💡 *Mẹo tiết kiệm:* Áp dụng mã \`AURA15\` khi đặt phòng để tiết kiệm ngay 15% chi phí lưu trú quý khách nhé!`;
  }

  // Case 10: Room booking & rates
  if (intent === 'room_booking') {
    if (dest) {
      return `🏰 **Thông Tin Phòng Nghỉ Tại ${dest.hotel.name}:**\n\n` +
        `• **Vị trí:** ${dest.name} - ${dest.tagline}\n` +
        `• **Giá khởi điểm:** Từ **${dest.hotel.priceFrom}** (đã bao gồm buffet sáng 5 sao).\n` +
        `• **Điểm nổi bật:** ${dest.hotel.highlight}.\n` +
        `• **Hạng phòng tiêu chuẩn:**\n` +
        `  1. *Deluxe Room* (ban công vọng cảnh, giường King êm ái, diện tích 45m²).\n` +
        `  2. *Executive / Heritage Suite* (phòng khách riêng biệt, bồn tắm nằm cao cấp, diện tích 75-90m²).\n` +
        `  3. *Aura Luxury Villa* (hồ bơi riêng biệt lập, sân vườn BBQ, quản gia phục vụ 24/7).\n` +
        `• **Mã ưu đãi gợi ý:** Nhập mã \`AURA15\` để được giảm 15% khi đặt phòng trực tuyến ngay hôm nay!`;
    }
  }

  // Default Fallback
  return `Dạ, em là **Aura Concierge** — Cố vấn Du lịch & Trải nghiệm Văn hóa Việt Nam 24/7. ✨\n\n` +
    `Em có thể hỗ trợ chi tiết cho quý khách về:\n` +
    `• 🗺️ **Lên lịch trình du lịch chi tiết** 1 - 4 ngày tại Sa Pa, Đà Nẵng, Hội An, Phú Quốc, Đà Lạt, Ninh Bình, Hạ Long, Huế.\n` +
    `• 🍜 **Gợi ý quán ăn ngon & đặc sản bản địa** đúng điệu từng vùng miền.\n` +
    `• ☀️ **Thời tiết & thời điểm đẹp nhất** để săn mây, ngắm lúa chín hay tắm biển.\n` +
    `• 🌸 **Trải nghiệm văn hóa địa phương:** Tắm lá thuốc Dao Đỏ, thả hoa đăng sông Hoài, chèo thuyền thúng, làm gốm...\n` +
    `• 🏰 **Tư vấn phòng nghỉ & ưu đãi** tại hệ thống resort cao cấp AuraResort.\n\n` +
    `Quý khách đang muốn lên kế hoạch đi đâu hay cần tìm hiểu món ăn, cảnh đẹp nào ạ?`;
}
