let qss = [];


function matchK1() {
    return k.match(/(?<=(Câu ))(\d){1,2}([\S\s](?!(A\))))*/gm);
}

function clean(v) {
    return v.map(e => {
        q = e.trim().substring(2).trim()
        if (q.startsWith(': ') || q.startsWith('. ')) q=q.substring(2);
        if (q.startsWith(':') || q.startsWith('.')) q=q.substring(1);
        return q.replace(/\s+/g,' ').trim();
    })
}

function matchA1() {
    a = k.match(/(?<=(A\)\:))(.)*(?=(( )*B\)\:|\n( )*?B)(?!ài))/gm).map(e=>e.replace(/\s+/g,' ').trim()).filter(xx => xx!=="");
    b = k.match(/(?<=(B\)\:))(.)*(?=(( )*C\)\:|\n( )*?C)(?!âu))/gm).map(e=>e.replace(/\s+/g,' ').trim()).filter(xx => xx!=="");
    c = k.match(/(?<=(C\)\:))(.)*(?=(( )*D\)\:|\n( )*?D)(?!âu))/gm).map(e=>e.replace(/\s+/g,' ').trim()).filter(xx => xx!=="");
    d = k.match(/(?<=(D\)\:))(.)*(?=\n)/gm).map(e=>e.replace(/\s+/g,' ').trim()).filter(xx => xx!=="");
    console.log(d);
    af = []
    for (let i = 0; i<a.length; i++) {
        af[i] = [[a[i], 0],[b[i], 1],[c[i], 2],[d[i],3]]
    }
    return af;
}
const conv = {
    "A" : 0,
    "B" : 1,
    "C" : 2,
    "D" : 3
}
const rconv = ["A", "B", "C", "D"];
function loadAns() {
    return an.split("").map(e => conv[e]);
}

function assemble() {
    al = loadAns();
    let as = matchA1(), ks = clean(matchK1());
    console.log(ks)
    sx = [];
    for (let i = 0; i<al.length; i++) {
        sx[i] = {
            q : ks[i],
            s : as[i],
            a : al[i]
        }
    }
    return sx;
}

let ss = [65, 65, 58],
    cc = 15;
function lgen() {
    que = assemble()
    count = 0;
    qlist = [];
    for (let i = 0; i<ss.length; i++) {
        for (let j = 0; j<cc; j++) {
            r = Math.floor(Math.random()*(ss[i]-j))
            e = que.splice(count+r,1);
            qlist.push(e);
            count-=1;
        }
        count+=ss[i];
    }
    qss = qlist;
    return qlist;
}

function renderQ(que) {
    document.getElementById("tlch").style.display = "none";
    document.getElementById("res").style.display = "none";
    qu = document.getElementById("qmain");
    qu.style.display = "";
    console.log(que);
    for (let i = 0; i<que.length; i++) {
        console.log(que[i][0])
        qu.insertAdjacentHTML("beforeend",`
<p>Câu ${i+1} : ${que[i][0]["q"]}</p><br>
<input type="radio" id="q${i}A" name="q${i}" value="A">
<label for="a1">A : ${que[i][0].s[0][0]}</label><br>
<input type="radio" id="q${i}B" name="q${i}" value="B">
<label for="b1">B : ${que[i][0].s[1][0]}</label><br>
<input type="radio" id="q${i}C" name="q${i}" value="C">
<label for="c1">C : ${que[i][0].s[2][0]}</label><br>
<input type="radio" id="q${i}D" name="q${i}" value="D">
<label for="d1">D : ${que[i][0].s[3][0]}</label><br><br>
        `)
    }
    qu.insertAdjacentHTML("beforeend",`
<form onsubmit="return false;" method="post" name="myForm">
<br><br><input type="submit" value="Nộp bài" onclick="ansk()" style="font-size: 200%;"> 
</form>
`)
}



function ansk() {
    let ansarr = new Array(40)
    for (let i = 0; i<40; i++) {
        try {
            v = document.querySelector(`input[name="q${i}"]:checked`).value
            ansarr[i] = conv[v];
        } catch {
            ansarr[i] = -1;
        }
    }
    let ac = 0;
    wr = [];
    cr = []
    ansarr.forEach((e, i) => {
        if (e===qss[i][0]["a"])  {
            ac+=1;cr.push([i, e, qss[i][0]])
        } else wr.push([i, e, qss[i][0]])
    });
    document.getElementById("tlch").style.display = "none";
    document.getElementById("qmain").style.display = "none";
    res = document.getElementById("res");
    res.style.display = "";
    res.insertAdjacentHTML("beforeend", `
<text id="nametext" style="font-family: Calibri;font-size: 300%;font-weight: bold;color: rgb(37, 117, 122);text-align: center;display: block;">Kết quả</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 250%;font-weight: bold;color: rgb(20, 63, 66);text-align: center;display: block;">${ac}/${cc*ss.length}</text><br><br>
<button onclick="start()" style="text-align: center;margin:auto; display:block;font-size: 200%;">Tạo đề mới</button><br><br><br>
    `)
    if (cr.length > 0) {
        res.insertAdjacentHTML("beforeend", `
        <text id="nametext" style="font-family: Calibri;font-size: 250%;font-weight: bold;color: rgb(37, 117, 122);text-align: center;display: block;">Những câu đúng</text><br>
        `)
        cr.forEach((e,i) => {
            res.insertAdjacentHTML("beforeend", `
<div id="ed${i}" style="margin: 5%;">
<text id="nametext" style="font-family: Calibri;font-size: 200%;font-weight: bold;color: rgb(37, 117, 122);text-align: center;">Câu ${e[0]+1}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 150%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">${e[2]["q"]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">A : ${e[2].s[0][0]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">B : ${e[2].s[1][0]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">C : ${e[2].s[2][0]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">D : ${e[2].s[3][0]}</text><br><br><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(30, 168, 18);text-align: center;">Đáp án đã chọn : ${e[1] === -1 ? "Không chọn" : rconv[e[1]]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(30, 168, 18);text-align: center;">Đáp án đúng : ${rconv[e[2]["a"]]}</text><br>
</div>
            `)
        });
  }
    res.insertAdjacentHTML("beforeend", `

<text id="nametext" style="font-family: Calibri;font-size: 250%;font-weight: bold;color: rgb(37, 117, 122);text-align: center;display: block;">Những câu sai</text><br>
`)
    wr.forEach((e,i) => {
      res.insertAdjacentHTML("beforeend", `
<div id="e${i}" style="margin: 5%;">
<text id="nametext" style="font-family: Calibri;font-size: 200%;font-weight: bold;color: rgb(37, 117, 122);text-align: center;">Câu ${e[0]+1}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 150%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">${e[2]["q"]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">A : ${e[2].s[0][0]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">B : ${e[2].s[1][0]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">C : ${e[2].s[2][0]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">D : ${e[2].s[3][0]}</text><br><br><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(243, 54, 29);text-align: center;">Đáp án đã chọn : ${e[1] === -1 ? "Không chọn" : rconv[e[1]]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(30, 168, 18);text-align: center;">Đáp án đúng : ${rconv[e[2]["a"]]}</text><br>
</div>
      `)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const an = "BBBCDDACDDACCDCABDBDDBDDCABAABBAABDAACADDAAACCDDAADDBCBDDACDBBACBBADCABAACAAABCDAAACAABADBAABADDCBABAADBADDDCDBAACABDDAAABBABDCCCAAADACBACDADACBCDACDDDCBCDDABBDACDBABDCCBAADACDDCBAABDADDDB"


const k = `CHỦ ĐỀ 1: CƠ CHẾ DT VÀ BD Ở CẤP ĐỘ PHÂN TỬ
Câu 1. Cơ sở vật chất của hiện tượng di truyền ở cấp độ phân tử là
A): prôtêin.		
B): axit nuclêic		
C): ARN		
D): ADN
Câu 2. Gen là một đoạn ADN 
A): mang thông tin cấu trúc của phân tử prôtêin.	
B): mang thông tin mã hoá cho một sản phẩm xác định là chuỗi polipéptít hay ARN.
C): mang thông tin di truyền.			
D): chứa các bộ 3 mã hoá các axitamin.
Câu 3. Mỗi gen mã hoá prôtêin điển hình gồm vùng
A): khởi đầu, mã hoá, kết thúc     	 
B): điều hoà, mã hoá, kết thúc    
C): điều hoà, vận hành, kết thúc       	 
D): điều hoà, vận hành, mã hoá.
Câu 4. Bản chất của mã di truyền là
A): một bộ ba mã hoá cho một axitamin.	      
B): 3 nuclêôtit liền kề cùng loại hay khác loại đều mã hoá 1 aa
C): trình tự sắp xếp các nulêôtit trong gen quy định trình tự sắp xếp các axit amin trong prôtêin.   
D): các axitamin đựơc mã hoá trong gen. 
Câu 5. Vì sao mã di truyền là mã bộ ba :
A): Vì mã bộ một và mã bộ hai không tạo được sự phong phú về thông tin di truyền.
B): Vì số nuclêotit ở mỗi mạch của gen dài gấp 3 lần số axit amin của chuỗi polipeptit.
C): Vì số nucleotit ở hai mạch của gen dài gấp 6 lần số axit amin của chuỗi polipeptit.
D): Vì 3 nucleotit mã hóa cho 1 aa thì số tổ hợp sẽ là 43 = 64 bộ ba dư thừa để mã hóa cho 20 loại aa.
Câu 6. Mã di truyền không có đặc điểm
A): có tính phổ biến
B): có tính đặc hiệu	
C): có tính thoái hoá	
D): có tính liên tục 
Câu 7. Số mã bộ ba mã hóa cho các axit amin là :
A): 61.                  
B): 42                 		
C): 6                           	
D): 21.     
Câu 8. Nhóm cô đon nào không mã hoá các axit amin mà làm nhiệm vụ kết thúc tổng hợp Prôtêin?
A): UAG,UGA,AUA      	
B): UAA,UAG,AUG    	
C): UAG,UGA,UAA	
D): UAG,GAU,UUA                
Câu 9. Quá trình tự nhân đôi của ADN có các đặc điểm:
1. Diễn ra ở trong nhân, tại kì trung gian của quá trình phân bào.
2. Diễn ra theo nguyên tắc bổ sung và nguyên tắc bán bảo toàn.
3. Cả hai mạch đơn đều làm khuôn để tổng hợp mạch mới.
4. Đoạn okazaki được tổng hợp theo chiều 5/   3/.
5 . Khi một phân tử ADN tự nhân đôi 2 mạch mới được tổng hợp đều được kéo dài liên tục với sự phát triển của chạc chữ Y
6. Qua một lần nhân đôi tạo ra hai ADN con có cấu trúc giống ADN mẹ. 
Phương án đúng là:
A): 1, 2, 3, 4, 5.	
B): 1, 2, 4, 5, 6.	
C): 1, 3, 4, 5, 6.	
D): 1, 2, 3, 4, 6. 
Câu 10. Đoạn okazaki là :
A): đoạn ADN được tổng hợp gián đoạn theo chiều tháo xoắn của ADN trong quá trình nhân đôi.
B): đoạn ADN được tổng hợp liên tục theo chiều tháo xoắn của ADN trong quá trình nhân đôi.
C): đoạn ADN được tổng hợp liên tục trên mạch ADN trong quá trình nhân đôi.
D): đoạn ADN được tổng hợp gián đoạn ngược chiều tháo xoắn của ADN trong quá trình nhân đôi.
Câu 11. Cho các dự kiện sau :1. Tổng hợp các mạch ADN mới.  2. Hai phân tử ADN con xoắn lại.   3. Tháo xoắn phân tử ADN mẹ. Quá trình tái bản của ADN gồm các bước:
A): 3,1,2                  
B): 1,2,3                              
C): 2,1,3                             
D): 3,2,1
Câu 12. Sự nhân đôi của ADN trên cơ sở nguyên tắc bổ sung có tác dụng :
A): Chỉ đảm bảo duy trì thông tin di truyền ổn định qua các thế hệ TB
B): Chỉ đảm bảo duy trì thông tin di truyền ổn định qua các thế hệ cơ thể.
C): Chỉ đảm bảo duy trì thông tin di truyền ổn định qua các thế hệ TB  và cơ thể.
D): Chỉ đảm bảo duy trì thông tin di truyền ổn định  từ nhân ra tế bào chất.
Câu 13. Các mạch đơn mới được tổng hợp trong quá trình nhân đôi của  phân tử ADN hình thành theo chiều:
A): Cùng chiều với mạch khuôn.      		
B): 3’ đến 5’     
C): 5’ đến 3’.        				
D): Cùng chiều với chiều tháo xoắn của ADN.
Câu 14. Các mã bộ ba khác nhau bởi :
A): Trật tự của các nucleotit.        		
B): Thành phần các nucleotit.   
C): Số lượng các nucleotit.    			
D): Thành phần và trật tự của các nucleotit.
Câu 15. Vai trò của enzim ADN polimeraza trong quá trình nhân đôi là :
A): Cung cấp năng lượng.                          	
B): Tháo xoắn ADN.
C):  Lắp ghép các nucleotit tự do theo nguyên tắc bổ sung vào mạch đang tổng hợp.
D): Phá vỡ các liên kết hidro giữa hai mạch của ADN.
Câu 16. Quá trình nhân đôi ADN chỉ có 1 mạch được tổng hợp liên tục, mạch còn lại tổng hợp gián đoạn vì
A): enzim xúc tác quá trình nhân đôi của ADN chỉ gắn vào đầu 3’ của polinucleotit ADN mẹ và mạch polinucleotit chứa ADN con kéo dài theo chiều 5’ 3’
B): enzim xúc tác quá trình nhân đôi của ADN chỉ gắn vào đầu 3’ của polinucleotit ADN mẹ và mạch polinucleotit chứa ADN con kéo dài theo chiều 3’5’ 
C): enzim xúc tác quá trình nhân đôi của ADN chỉ gắn vào đầu 5’ của polinucleotit ADN mẹ và mạch polinucleotit chứa ADN con kéo dài theo chiều 3’5’
D): hai mạch của phân tử ADN ngược chiều nhau và có khả năng nhân đôi theo nguyên tắc bổ sung.	
Câu 17. Ở cấp độ phân tử, thông tin di truyền được truyền từ tế bào mẹ sang tế bào con nhờ cơ chế 
A): dịch mã.           	
B): nhân đôi ADN.	   
C): phiên mã.             	
D): giảm phân và thụ tinh. 
Câu 18. Phân tử ADN ở vi khuẩn E.côli chỉ chứa N15 phóng xạ. Khi chuyển vi khuẩn này sang môi trường chỉ có N14  thì sau 5 lần nhân đôi liên tiếp sẽ tạo ra số lượng phân tử ADN mới chỉ chứa toàn N14 là:
A): 5	
B): 10				
C): 20			
D): 30
Câu 19. Trên một mạch của gen có 150 ađênin và 120 timin. Gen nói trên có 20% guanin. Số lượng từng loại nuclêôtit của gen 
A): A = T = 180; G = X =270  			
B): A = T = 270; G = X = 180  
C): A = T = 360; G = X = 540  			
D): A = T = 540; G = X = 360 
Câu 20. Một gen có chiều dài 1938 ăngstron và có 1490 liên kết hiđrô. Số lượng từng loại nuclêôtit của gen là: 
A): A = T = 250; G = X = 340 			
B): A = T = 340; G = X = 250 
C): A = T = 350; G = X = 220 			
D): A = T = 220; G = X = 350 
Câu 21. Người ta dựa vào đặc điểm nào sau đây để chia 3 loại ARN là mARN, tARN, rARN?
A): cấu hình không gian 			
B): số loại đơn phân	
C): khối kượng và kích thước		
D): chức năng của mỗi loại.
Câu 22. Loại ARN nào mang bộ ba đối mã.
A): mARN.     		
B): tARN.      	 	
C): rARN.          	
D): ARN của virut.
Câu 23. Phiên mã là quá trình:
A): Tổng hợp chuỗi pôlipeptit					
B): Nhân đôi ADN
C): Duy trì thông tin di truyền qua các thế hệ		
D): Truyền thông tin di truyền từ trong nhân ra ngoài tế bào
Câu 24. Phát biểu nào sau đây là không đúng khi nói về quá trình phiên mã?
A): Phiên mã diễn ra trong nhân tế bào	  
B): Quá trình phiên mã bắt đầu từ chiều 3, của mạch gốc ADN
C): Vùng nào trên gen vừa phiên mã xong thì 2 mạch đơn đóng xoắn lại ngay
D): Các nu liên kết với nhau theo nguyên tắc bổ sung: A - T; G - X
Câu 25. Cho các sự kiện diễn ra trong quá trình phiên mã:
(1)	ARN pôlimeraza bắt đầu tổng hợp mARN tại vị trí đặc hiệu (khởi đầu phiên mã).
(2)	ARN pôlimeraza bám vào vùng điều hòa làm gen tháo xoắn để lộ ra mạch gốc có chiều 3’→5’.a
(3)	ARN pôlimeraza trượt dọc theo mạch mã gốc trên gen có chiều 3’→5’.
(4)	Khi ARN pôlimeraza di chuyển tới cuối gen, gặp tín hiệu kết thúc thì nó dừng phiên mã.
Trong quá trình phiên mã, các sự kiện trên diễn ra theo trình tự đúng là:
A): (1)→(4)→(3)→(2)   
B): (2)→(3)→(1)→(4)    
C): (2)→(1)→(3)→(4)   
D): (1)→(2)→(3) →(4)
Câu 26. Khác nhau trong quá trình phiên mã ở sinh vật nhân sơ và sinh vật nhân thực là
A): ở tế bào nhân sơ mARN sau khi được tổng hợp trực tiếp làm khuôn để tổng hợp prôtêin, ở sinh vật nhân thực mARN được loại bỏ các intrôn và nối các exôn lại với nhau.
B): ở tế bào nhân thực mARN sau khi được tổng hợp trực tiếp làm khuôn để tổng hợp prôtêin, ở sinh vât nhân sơ mARN được loại bỏ các intrôn và nối các exôn lại với nhau.
C): ở tế bào nhân sơ ADN sau khi được tổng hợp trực tiếp làm khuôn để tổng hợp prôtêin, ở sinh vật nhân thực ADN được loại bỏ các intrôn và nối các exôn với nhau.
D): ở tế bào nhân thực sau khi ADN được tổng hợp trực tiếp làm khuôn để tổng hợp prôtêin, ở sinh vật nhân sơ ADN được loại bỏ cá intrôn và nối các exôn với nhau.
Câu 27. Trình tự một đoạn mạch gốc của gen như sau:     5’... AXX ATA GGT ... 3’.  Trình tự các codon trên mARN sẽ là:
A): 5’... AXX ATA GGT ... 3’.					
B): 5’... AXX UAU GGU ... 3’.
C): 3’... AXX ATA GGT ... 5’.					
D): 3’... UGG UAU XXA ... 5’.
Câu 28. Dịch mã là
A): quá trình mã di truyền chứa trong mARN được chuyển thành cấu trúc bậc 1 của prôtêin.
B): quá trình mã di truyền chứa trong mARN được chuyển thành cấu trúc bậc 2 của prôtêin.
C): quá trình mã di truyền chứa trong mARN được chuyển thành cấu trúc bậc 3 của prôtêin.
D): quá trình mã di truyền chứa trong mARN được chuyển thành cấu trúc bậc 4 của prôtêin.
Câu 29. Giai đoạn hoạt hoá aa của quá trình dịch mã diễn ra ở 
A): tế bào chất		
B): nhân			
C): màng nhân		
D): nhân con
Câu 30. Kết quả của giai đoạn hoạt hóa các axitamin là :
A): Tạo phức hợp aa-ATP					
B): Tạo phức hợp aa-tARN
C): Tạo phức hợp aa-tARN-Ribôxôm		
D): Tạo phức hợp aa-tARN-mARN
Câu 31. Cho các sự kiện diễn ra trong quá trình dịch mã ở tế bào nhân thực như sau:
(1)	Bộ ba đối mã của phức hợp Met – tARN (UAX) gắn bổ sung với côđon mở đầu (AUG) trên mARN
(2)	Tiểu đơn vị lớn của ribôxôm kết hợp với tiểu đơn vị bé tạo thành ribôxôm hòan chỉnh.
(3)	Tiểu đơn vị bé của ribôxôm gắn với mARN ở vị trí nhận biết đặc hiệu.
(4)	Côđon thứ hai trên mARN gắn bổ sung với anticôđon của phức hệ aa¬1¬ – tARN (aa-1¬: axit amin gắn liền sau axit amin mở đầu).
(5)	Ribôxôm dịch đi một côđon trên mARN theo chiều 5’   3’.
(6)	Hình thành liên kết peptit giữa axit amin mở đầu và aa¬1¬.
Thứ tự đúng của các sự kiện diễn ra trong giai đoạn mở đầu và giai đoạn kéo dài chuỗi pôlipeptit là:
A): (1)  (3)  (2)  (4)  (6)  (5).	
B):  (3)  (1)  (2)  (4)  (6)  (5).
C): (2)  (1)  (3)  (4)  (6)  (5).	
D): (5)  (2)  (1)  (4)  (6)  (3).
Câu 32. Trong quá trình dịch mã, hoạt động của polyribôxôm giúp
A): nâng cao hiệu suất tổng hợp prôtêin.	   
B): các ribôxôm hỗ trợ nhau trong quá trình dịch mã.
C): không ribôxôm này thì ribôxôm khác sẽ tổng hợp prôtêin.	  
D): kéo dài thời gian sống của mARN
Câu 33. Một đoạn polipeptit gồm có trình tự aa như sau: … Alamin – Lizin – Xistêin – Lizin  …
Biết rằng các aa được mã hoá bởỉ bộ ba trên mARN như sau: Xistêin : UGX, lizin: AAA, Alamin: GXA. Đoạn ARN thông tin tương ứng có trình tự nu là
A): …GXA – AAA – UGX – AAA…		
B): …AAA – GXA – UGX – AAA …
C): …GXX – AAA – UGG – AAA…		
D): …AAA – GXA – AAA – UGX…
Câu 34. Quan hệ nào sau đây là đúng:	
A): ADN tARN mARN Prôtêin			
B): ADN mARN Prôtêin Tính trạng
C): mARN ADN Prôtêin Tính trạng		
D): ADN mARN Tính trạng
Câu 35. Gen có chiều dài 2601A0. Khi gen phiên mã, cần môi trường cung cấp tất cả 3060 ribônu tự do.  Số lần phiên mã của gen trên là
A): 1	
B): 2			
C): 3			
D): 4
Câu 36. Một gen có 90 chu kỳ xoắn. Khi tổng hợp một phân tử prôtêin sẽ cần môi trường cung cấp số axit amin 
A): 299.                    
B): 298.                             
C): 300.                       
D): 599.
Câu 37. Điều hòa hoạt động của gen ở sinh vật nhân sơ được hiểu là :
A): Gen có được phiên mã và dịch mã hay không.         
B): Gen có được biểu hiện kiểu hình hay không.
C): Gen có được dịch mã hay không.          		
D): Gen có được phiên mã hay không.
Câu 38. Theo giai đoạn phát triển của cá thể và theo nhu cầu hoạt động sống của tế bào thì 
A): Tất cả các gen trong tế bào điều hoạt động.           
B): Phần lớn các gen trong tế bào đều hoạt động.
C): Chỉ có một số gen trong tế bào hoạt động.            
D): Tất cả các gen trong tế bào có lúc đồng hoạt động có khi đồng loạt dừng.
Câu 39. Ôpêron là
A): một nhóm gen ở trên 1 đoạn ADN có liên quan về chức năng, có chung một cơ chế điều hoà.
B): một đoạn phân tử ADN có một chức năng nhất định trong quá trình điều hoà.
C): một đoạn phân tử axit nuclêic có chức năng điều hoà hoạt động của gen cấu trúC):
D): một tập hợp gồm các gen cấu trúc và gen điều hoà nằm cạnh nhau.
Câu 40. Cấu trúc của ôperon bao gồm những thành phần nào :
A): Gen điều hòa, nhóm gen cấu trúc,vùng vận hành. 
B): Gen điều hòa,nhóm gen cấu trúc,vùng khởi động
C): Gen điều hòa,vùng khởi động,vùng vận hành.     
D): Nhóm gen cấu trúc,vùng vận hành,vùng khởi động 
Câu 41. Ở opêron Lac, khi có đường lactôzơ thì quá trình phiên mã diễn ra vì lactôzơ gắn với
A): chất ức chế làm cho nó bị bất hoạt			
B): vùng vận hành, kích hoạt vùng vận hành.
C): enzim ARN pôlimêraza làm kích hoạt enzim này.	
D): prôtêin ức chế, làm biến đổi cấu hình prôtêin ức chế, giải phóng vùng (O)
Câu 42. Cơ chế điều hoà đối với ôpêrôn Lac ở E. coli dựa vào tương tác của yếu tố nào?
A): Dựa vào tương tác của prôtêin ức chế với vùng O   
B): Dựa vào tương tác của prôtêin ức chế với vùng P
C): Dựa vào tương tác của prôtêin ức chế với gen điều hoà.   
D): Dựa vào tương tác của prôtêin ức chế với nhóm gen cấu trúc
Câu 43. Gen cấu trúc không thực hiện phiên mã khi
A): chất ức chế liên kết với vùng vận hành.         
B): chất ức chế liên kết với vùng khởi động.
C): chất ức chế liên kết với gen điều hòa.             
D): chất ức chế bị bất hoạt.
Câu 44. Trong cơ chế điều hòa hoạt động ôperon Lac ở E. coli, khi nào thì gen cấu trúc ở trạng thái hoạt động 
A): Khi môi trường có chất cảm ứng (Lactôzơ)     
B): Khi môi trường không có chất cảm ứng (Lactôzơ)
C): Khi vùng khởi động bất hoạt                         
D): Khi prôtêin ức chế liên kết với vùng vận hành 
Câu 45. Trong cơ thể điều hòa hoạt động của Operon Lac, sự kiện nào sau đây diễn ra cả khi môi trường có lactozo và khi môi trường không có lactozo?
A): ARN polimeraza liên kết với vùng khởi động của operon Lac và tiến hành phiên mã. 
B): Một số phân tử Lactôzơ liên kết với Protein ức chế
C): Gen điều hòa R tổng hợp protein ức chế	
D): Các gen cấu trúc Z,Y,A phiên mã tạo ra các phân tử mARN tương ứng
Câu 46. Sự biểu hiện điều hoà hoạt động của gen ở sinh vật nhân sơ diễn ra ở cấp độ nào?
A): Diễn ra ở các cấp độ tháo xoắn nhiễm sắc thể, phiên mã, sau phiên mã, dịch mã và sau dịch mã. 
B): Diễn ra chủ yếu ở các cấp độ phiên mã, dịch mã	    
C): Diễn ra chủ yếu ở cấp độ phiên mã.
D): Diễn ra ở các cấp độ trước phiên mã, phiên mã và dịch mã.
Câu 47. Sự điều hoà hoạt động của gen nhằm
A): tổng hợp ra prôtêin cần thiết.			
B): ức chế sự tổng hợp prôtêin vào lúc cần thiết.
C): cân bằng giữa sự cần tổng hợp và không cần tổng hợp prôtêin.	  
D): đảm bảo cho hoạt động sống của tế bào trở nên hài hoà
Câu 48. Thể đột biến là 
A): cá thể mang đồng thời nhiều đột biến		
B): cá thể mang đột biến chưa biểu hiện ra kiểu hình
C): quần thể có nhiều cá thể mang đột biến	
D): cá thể mang đột biến đã biểu hiện ra kiểu hình
Câu 49. Phát biểu không đúng về đột biến gen là
A): đột biến gen làm thay đổi vị trí của gen trên NST.
B): đột biến gen làm biến đổi đột ngột một hoặc một số tính trạng nào đó trên cơ thể sinh vật.
C): đột biến gen là phát sinh các alen mới trong quần thể.
D): đột biến điểm liên quan đến một cặp nuclêotit trong cấu trúc của gen.
Câu 50. Đột biến điểm có các dạng
A): mất, thêm, thay thế 1 cặp nuclêotit.		
B): mất, thêm 1 hoặc vài cặp nuclêôtit.
C): mất, thay thế 1 hoặc vài cặp nuclêôtit.		
D): thêm, thay thế 1 hoặc vài cặp nuclêôtit
Câu 51. Loại đột biến gen nào sau đây có khả năng nhất không làm thay đổi thành phần aa trong chuỗi polypeptit 
A): Thêm 1 cặp nucleotit.                  
B): Thay thế 1 cặp nucleotit ở vị trí thứ hai trong bộ ba mã hóa.
C): Mất 1 cặp nucleotit.                     
D): Thay thế 1 cặp nucleotit ở vị trí thứ ba trong bộ ba mã hóa.
Câu 52. Cho các thông tin về đột biến sau đây:
 (1) Xảy ra ở cấp độ phân tử, thường có tính thuận nghịch.    
 (2) Làm thay đổi số lượng gen trên nhiễm sắc thể.
3) Làm mất một hoặc nhiều phân tử ADN        
(4) Làm xuất hiện những alen mới trong quần thể.
	Các thông tin nói về đột biến gen là:
A): (2) và (3) 	
B): (1) và (2)	
C): (3) và (4)	
D): (1) và (4)
Câu 53. Loại đột biến gen nào xảy ra làm tăng 1 liên kết hidro của gen :
A): Thay thế 1 cặp A – T bằng cặp T – A.            		
B): Thay thế 1 cặp A – T bằng cặp G – X. 
C): Thêm 1 cặp nucleotit.                                        	
D): Mất 1 cặp nucleotit.
Câu 54. Khi nói về nguyên nhân và cơ chế phát sinh đột biến gen, phát biểu nào sau đây là không đúng?
A): Trong quá trình nhân đôi ADN, sự có mặt của bazơ nitơ dạng hiếm  có thể phát sinh đột biến gen.
B): Đột biến gen được phát sinh chủ yếu trong quá trình nhân đôi ADN.
C): Tần số phát sinh đột biến gen không phụ thuộc vào liều lượng, cường độ của tác nhân gây đột biến
D): Đột biến gen phát sinh do tác động của các tác nhân lí hoá ở môi trường hay do các tác nhân hoá học
Câu 55. Hoá chất gây đột biến thay thế cặp A-T thành G-X là 5- BU. Quá trình thay thế được mô tả theo sơ đồ
A): A -T→ G - 5BU→ X - 5BU → G - X		
B): A -T→ A - 5BU→ G - 5BU →G - X
C): A -T→ X - 5BU→ G - 5BU → G - X		
D): A -T→ G - 5BU→ G - 5BU →G - X
Câu 56. Đột biến gen có thể xảy ra ở đâu?
A): Trong nguyên phân ở tế bào sinh dưỡng và tế bào sinh dục		
B): Trong nguyên phân và giảm phân ở tế bào sinh dưỡng
C): Trong giảm phân ở tế bào sinh dưỡng và tế bào sinh dục
D): Trong nguyên phân và giảm phân ở tế bào sinh dưỡng và tế bào sinh dục
Câu 57. Sơ đồ nào sau đây diễn tả sự biến đổi trong gen cấu trúc là đúng ? 
A): Gen đột biến → prôtêin đột biến → ARN thông tin đột biến.    
B): ARN thông tin đột biến → gen đột biến → prôtêin đột biến.
C): Prôtêin đột biến → gen đột biến → ARN thông tin đột biến.    
D): Gen đột biến → ARN thông tin đột biến → prôtêin đột biến.
Câu 58. Đột biến gen có ý nghĩa đối với tiến hoá vì
A): làm xuất hiện các alen mới, tổng đột biến trong quần thể lớn.    
B): tổng đột biến trong quần thể có số lượng lớn nhất.
C): đột biến gen không gây hậu quả nghiêm trọng.	
D): đột biến gen là những đột biến nhỏ.
Câu 59. Guanin dạng hiếm kết cặp với timin trong nhân đôi ADN tạo nên
A): 2 phân tử timin trên cùng đoạn mạch ADN.		
B): đột biến A – T          G – X.
C): đột biến G – X    A – T.				
D): sự sai hỏng ngẫu nhiên.
Câu 60. Một đoạn mạch gốc của gen sao mã ra mARN có trình tự các nu như sau: 
	....... TGG GXA XGT AGX TTT .........
	...........2........3.......4........5.......6............
Đột biến xảy ra làm G của bộ ba thứ 5 ở mạch gốc của gen bị thay bởi T sẽ làm cho 
A): trình tự axit amin từ vị trí mã thứ 5 trở đi sẽ thay đổi.	  
B): chỉ có axit amin ở vị trí mã thứ 5 là thay đổi.
C): quá trình tổng hợp prôtêin sẽ bắt đầu ở vị trí mã thứ 5.	  
D): quá trình dịch mã sẽ dừng lại ở vị trí mã thứ 5
Câu 61. Trường hợp đột biến gen nào gây hậu quả lớn nhất?
A): Thêm 3 cặp nuclêotit trước mã kết thúc	  
B): Mất cặp nuclêotit đầu tiên sau bộ ba mở đầu.
C): Thay thế 1 cặp nuclêotit ở đoạn giữa.		  
D): Mất 3 cặp nuclêotit trước mã kết thúc
Câu 62. Chuỗi pôlipeptit do gen đột biến tổng hợp so với chuỗi pôlipeptit do gen bình thường tổng hợp có số axit amin bằng nhau nhưng khác nhau về axit amin thứ 80. Gen cấu trúc đã bị đột biến dạng
A): mất cặp nu ở vị trí 80	
B): thay thế 1 cặp nu này bằng 1 căp nu khác ở bộ 3 thứ 80.
C): thêm 1 cặp nu vào vị trí 80.				             
D): thêm 1 cặp nu vào vị trí bộ 3 thứ 80.
Câu 63. Gen A dài 4080Å bị đột biến thành gen a. Khi gen a tự nhân đôi một lần, môi trường nội bào đã cung cấp 2398 nuclêôtit. Đột biến trên thuộc dạng 
A): mất 1 cặp nuclêôtít. 	
B): thêm 1 cặp nuclêôtít.       
C): thêm 2 cặp nuclêôtít. 	
D): mất 2 cặp nuclêôtít
Câu 64. Một gen bình thường điều khiển tổng hợp một prôtêin có 498 axit amin. Đột biến đã tác động trên một cặp nuclêôtit và sau đột biến tổng số nuclêôtit của gen bằng 3000. Dạng đột biến gen xảy ra là
A): thay thế hoặc đảo cặp nu. 	
B): mất hoặc thêm cặp nu.       
C): thay thế cặp nu.     
D): đảo cặp nu.	
Câu 65. Một phân tử mARN dài 4080Ao tiến hành dịch mã đã cho 5 Ribôxôm trượt qua một lần. Số lượt tARN mang axit amin đến ribôxôm là 
A):  2000 .                         
B): 1995.
C): 2990.                                          
D): 3990
CHỦ ĐỀ 7: BẰNG CHỨNG VÀ CƠ CHẾ TIẾN HOÁ
Câu 1. Cơ quan tương đồng là những cơ quan
A): có nguồn gốc khác nhau nhưng đảm nhiệm những chức phận giống nhau, có hình thái tương tự.
B): cùng nguồn gốc, nằm ở những vị trí tương ứng trên cơ thể, có kiểu cấu tạo giống nhau.
C): cùng nguồn gốc, đảm nhiệm những chức phận giống nhau.
D): có nguồn gốc khác nhau, nằm ở những vị trí tương ứng trên cơ thể, có kiểu cấu tạo giống nhau.
Câu 2. Cơ quan tương tự là những cơ quan
A): có nguồn gốc khác nhau nhưng đảm nhiệm những chức phận giống nhau, có hình thái tương tự.
B): cùng nguồn gốc, nằm ở những vị trí tương ứng trên cơ thể, có kiểu cấu tạo giống nhau.
C): cùng nguồn gốc, đảm nhiệm những chức phận giống nhau.
D): có nguồn gốc khác nhau, nằm ở những vị trí tương ứng trên cơ thể, có kiểu cấu tạo giống nhau.
Câu 3. Kapêtrencô (1927) đã tạo ra loài cây mới từ cải củ (2n = 18) và cải bắp (2n = 18) như thế nào?
A): Lai cải bắp với cải củ tạo ra con lai hữu thụ.
B): Đa bội hoá dạng cải bắp rồi cho lai với cải củ tạo ra con lai hữu thụ.
C): Đa bội hoá dạng cải củ rồi cho lai với cải bắp tạo ra con lai hữu thụ.
D): Lai cải bắp với cải củ được F1, đa bội hoá F1 được dạng lai hữu thụ.
Câu 4. Chiều hướng tiến hoá cơ bản nhất của sinh giới là
A): ngày càng đa dạng, phong phú.				
B): tổ chức ngày càng cao.
C): thích nghi ngày càng hợp lý.					
D): Ngày càng phân hoá.
Câu 5. Bằng chứng nào sau đây phản ánh sự tiến hoá hội tụ (đồng quy) ?
A): Gai cây hoàng liên là biến dạng của lá, gai cây hoa hồng là do sự phát triển của biểu bì thân
B): Gai xương rồng, tua cuốn của đậu Hà Lan đều là biến dạng của lá.
C): Chi trước của các loài động vật có xương sống có các xương phân bố theo thứ tự tương tự nhau.
D): Trong hoa đực của cây đu đủ có 10 nhị, ở giữa hoa vẫn còn di tích của nhuỵ.
Câu 6. Ví dụ nào dưới đây thuộc cơ quan tương đồng:
A): Vây cá và vây cá voi.				
B): Cánh dơi và cánh chim.
C): Cánh dơi và cánh của sâu bọ.			
D): Cánh bướm và cánh chim.
Câu 7. Các cơ quan thoái hoá là cơ quan:
A): Phát triển không đầy đủ ở cơ quan trưởng thành	
B): Thay đổi cấu tạo phù hợp với chức năng mới
C): Thay đổi cấu tạo khác với tổ tiên			
D): Biến mất hoàn toàn  
Câu 8. Nội dung của học thuyết tế bào:
A): Tất cả các cơ thể sinh vật từ đơn bào đến thực, động vật đều được cấu tạo từ tế bào
B): Tất cả các dạng sống đều có cấu tạo tế bào 
C): Tất cả các sinh vật đa bào đều có cấu tạo tế bào 
D): Tất cả các tế bào đều có cấu tạo cơ bản giống nhau
Câu 9. Phát biểu nào sau đây đúng?
A): Các loài có quan hệ họ hàng càng gần nhau thì trình tự các các nuclêôtit càng giống nhau và ngược lại
B): Các loài có quan hệ họ hàng càng gần nhau thì trình tự các các axitamin càng giống nhau và ngược lại
C): Các loài có quan hệ họ hàng càng gần nhau thì trình tự các các nuclêôtit và axitamin càng giống nhau và ngược lại
D): Các loài có quan hệ họ hàng càng gần nhau thì số lượng các các nu và axitamin càng giống nhau và ngược lại
Câu 10. Để xác định mối quan hệ họ hàng giữa người và các loài thuộc bộ Linh trưởng (bộ Khỉ), người ta nghiên cứu mức độ giống nhau về ADN của các loài này so với ADN của người. Kết quả thu được (tính theo tỉ lệ % giống nhau so với ADN của người) như sau : khỉ Rhesut : 91,1%; tinh tinh : 97,6%; khỉ Capuchin : 84,2%; vượn Gibbon : 94,7%; khỉ Vervet : 90,5%. Căn cứ vào kết quả này có thể xác định mối quan hệ họ hàng xa dần giữa người và các loài thuộc bộ Linh trưởng nói trên theo trật tự đúng là :
A): Người - tinh tinh - vượn Gibbon - khỉ Rhesut - khỉ Vervet - khỉ Capuchin 	
B): Người - tinh tinh - khỉ Vervet - vượn Gibbon - khỉ Capuchin - khỉ Rhesut
C): Người - tinh tinh - khỉ Rhesut - vượn Gibbon - khỉ Capuchin - khỉ Vervet
D): Người - tinh tinh - vượn Gibbon - khỉ Vervet - khỉ Rhesut - khỉ Capuchin
Câu 11. Các tế bào của tất cả các loài sinh vật hiện nay đều sử dụng chung một loại mã di truyền, đều dùng cùng 20 loại axit amin để cấu tạo nên prôtêin, Đây là bằng chứng chứng tỏ:
A): Các loài sinh vật hiện nay đã được tiến hoá từ một tổ tiên chung.
B): các gen của các loài sinh vật khác nhau đều giống nhau.    
C): tất cả các loài sinh vật hiện nay là kết quả của tiến hoá hội tụ.
D): prôtêin của các loài sinh vật khác nhau đều giống nhau.
Câu 12. Bằng chứng nào sau đây không được xem là bằng chứng sinh học phân tử?
A): Các cơ thể sống đều được cấu tạo bởi tế bào. 
B): ADN của các loài sinh vật đều được cấu tạo từ 4 loại nuclêôtit. 
C): Mã di truyền của các loài sinh vật đều có đặc điểm giống nhau. 
D): Prôtêin của các loài sinh vật đều được cấu tạo từ khoảng 20 loại axit amin. 
Câu 13. Đác Uyn quan niệm biến dị cá thể là
A): những biến đổi trên cơ thể sinh vật dưới tác động của ngoại cảnh và tập quán hoạt động.
B): sự phát sinh những sai khác giữa các cá thể trong loài qua quá trình sinh sản.
C): những biến đổi trên cơ thể sinh vật dưới tác động của ngoại cảnh và tập quán hoạt động nhưng DT đượC):
D): những đột biến phát sinh do ảnh hưởng của ngoại cảnh.
Câu 14. Chọn lọc tự nhiên là quá trình:
A): Đào thải những biến dị bất lợi cho sinh vật
B): Tích lũy những biến dị có lợi cho sinh vật
C): Vừa đào thải những biến dị bất lợi vừa tích lũy những biến dị có lợi cho sinh vật
D): Tích lũy những biến dị có lợi cho con người và cho sinh vật
Câu 15. Theo Đacuyn, động lực của chọn lọc tự nhiên là:
A): Thức ăn, kẻ thù, dịch bệnh			
B): Thức ăn, kẻ thù, các nhân tố vô sinh	
C): Điều kiện sống 				
D): Đấu tranh sinh tồn
Câu 16. Theo Đacuyn, chọn lọc dựa trên cơ sở:
1 : di truyền	2 : biến dị		3 : đột biến		4 : phân li tính trạng
Phát biểu đúng là:
A): 1, 2	
B): 1,2,3		
C): 1,2,4				
D): 1,2,3,4
Câu 17. Kết quả của chọn lọc tự nhiên theo quan niệm của Đacuyn:
A): Hình thành các loài mới    			
B): Hình thành các nòi mới  
C): Hình thành các giống mới			
D): Hình thành các nhóm phân loại trên loài	
Câu 18. Theo Đác Uyn nguyên nhân tiến hoá là do
A): tác động của chọn lọc tự nhiên thông qua đặc tính biến dị và di truyền trong điều kiện sống không ngừng thay đổi.
B): ngoại cảnh không đồng nhất và thường xuyên thay đổi là nguyên nhân là cho các loài biến đổi.
C): ảnh hưởng của quá trình đột biến, giao phối.
D): ngoại cảnh luôn thay đổi là tác nhân gây ra đột biến và chọn lọc tự nhiên.
Câu 19. Theo ĐácUyn loài mới được hình thành từ từ qua nhiều dạng trung gian
A): và không có loài nào bị đào thải.			
B): dưới tác dụng của môi trường sống.
C): dưới tác dụng của chọn lọc tự nhiên theo con đường phân ly tính trạng từ một nguồn gốc chung.
D): dưới tác dụng của các nhân tố tiến hoá.
Câu 20. Theo quan niệm của Đacuyn, sự hình thành nhiều giống vật nuôi, cây trồng trong mỗi loài xuất phát từ một hoặc vài dạng tổ tiên hoang dại là kết quả của quá trình
A): phân li tính trạng trong chọn lọc nhân tạo.		
B): phân li tính trạng trong chọn lọc tự nhiên.
C): tích luỹ những biến dị có lợi, đào thải những biến dị có hại đối với sinh vật.
D): phát sinh các biến dị cá thể.
Câu 21. Theo quan niệm của Đacuyn, đơn vị tác động của chọn lọc tự nhiên là
A): cá thể.		
B): quần thể.		
C): giao tử.		
D): nhiễm sắc thể.
Câu 22. Giải thích mối quan hệ giữa các loài Đacuyn cho rằng các loài
A): là kết quả của quá trình tiến hoá từ rất nhiều nguồn gốc khác nhau.
B): là kết quả của quá trình tiến hoá từ một nguồn gốc chung.
C): được biến đổi theo hướng ngày càng hoàn thiện nhưng có nguồn gốc khác nhau.
D): đều được sinh ra cùng một thời điểm và đều chịu sự chi phối của chọn lọc tự nhiên.
Câu 23. Tồn tại chủ yếu trong học thuyết Đacuyn là chưa
A): hiểu rõ nguyên nhân phát sinh biến dị và cơ chế di truyền các biến dị.
B): giải thích thành công cơ chế hình thành các đặc điểm thích nghi ở sinh vật.
C): đi sâu vào các con đường hình thành loài mới.		
D): làm rõ tổ chức của loài sinh học
Câu 24. Đóng góp chủ yếu của thuyết tiến hóa tổng hợp:
A): Xây dựng cơ sở lí thuyết cho tiến hóa lớn	      
B): Tổng hợp các bằng chứng tiến hóa từ nhiều lĩnh vực
C): Giải thích tính đa dạng và thích nghi của sinh giới		
D): Làm sáng tỏ cơ chế tiến hóa nhỏ
Câu 25. Tiến hoá nhỏ là quá trình 
A):  hình thành các nhóm phân loại trên loài.
B): biến đổi thành phần kiểu gen của quần thể dẫn tới sự hình thành loài mới.
C): biến đổi kiểu hình của quần thể dẫn tới sự hình thành loài mới.
D): biến đổi thành phần kiểu gen của quần thể dẫn tới sự biến đổi kiểu hình.
Câu 26. Tiến hoá lớn là quá trình 
A):  hình thành các nhóm phân loại trên loài.				
B): hình thành loài mới.
C): biến đổi kiểu hình của quần thể dẫn tới sự hình thành loài mới.
D): biến đổi thành phần kiểu gen của quần thể dẫn tới sự hình thành các nhóm phân loại trên loài.
Câu 27. Trong các phát biểu sau, phát biểu không đúng về tiến hoá nhỏ là
A): tiến hoá nhỏ là hệ quả của tiến hoá lớn.
B): quá trình tiến hoá nhỏ diễn ra trong phạm vi phân bố tương đối hẹp.
C): quá trình tiến hoá nhỏ diễn ra trong thời gian lịch sử tương đối ngắn.
D): tiến hoá nhỏ có thể nghiên cứu bằng thực nghiệm.
Câu 28. Theo thuyết tiến hoá hiện đại, đơn vị tiến hoá cơ sở ở các loài giao phối là
A): cá thể.		
B): quần thể.		
C): nòi.			
D): loài.
Câu 29. Tại sao quần thể là đơn vị tiến hóa cơ sở?
A): có tính toàn vẹn trong không gian và thời gian, tồn tại thực trong tự nhiên, biến đổi cấu trúc di truyền qua các thế hệ
B): là đơn vị tồn tại, sinh sản của loài trong tự nhiên,  đa hình về kiểu gen và kiểu hình.
C): có cấu trúc di truyền ổn định, cách ly tương đối với các quần thể khác trong loài, có khả năng biến đổi vốn gen dưới tác dụng của các nhân tố tiến hoá.
D): là đơn vị tồn tại, sinh sản của loài trong tự nhiên, là  hệ gen kín, không trao đổi gen với các loài khác
Câu 30. Các nhân tố tiến hóa gồm: 1: đột biến    2: cách li	     3:chọn lọc tự nhiên   4:sinh sản     5: các yếu tố ngẫu nhiên	  6: giao phối ngẫu nhiên	7: giao phối không ngẫu nhiên	8: di nhập gen
Phát biểu đúng là
A): 1,2,3,4,5		
B): 1,2,3,6,7		
C): 1,3,4,5,8			
D): 1,3,5,7,8
Câu 31. Theo quan niệm hiện đại, nguồn nguyên liệu của chọn lọc tự nhiên là
A): thường biến 			
B): thường biến và biến dị xác định.
C): biến dị xác định.		
D): đột biến và biến dị tổ hợp.
Câu 32. Các nhân tố có vai trò cung cấp nguyên liệu cho quá trình tiến hóa:
A): Quá trình giao phối và chọn lọc tự nhiên		
B): Quá trình đột biến và biến động di truyền
C): Quá trình đột biến và quá trình giao phối		
D): Quá trình đột biến và các cơ chế cách li	
Câu 33. Trong quá trình tiến hoá nhân tố làm thay đổi tần số alen của quần thể chậm nhất là
A): giao phối.		
B): đột biến.		
C): chọn lọc tự nhiên.		
D): các cơ chế cách ly.
Câu 34. Vai trò chính của quá trình đột biến đối với tiến hóa là đã tạo ra
A): nguồn nguyên  liệu sơ cấp cho quá trình tiến hoá.      
B): nguồn nguyên liệu thứ cấp cho quá trình tiến hoá
C): những tính trạng khác nhau giữa các cá thể cùng loài.		
D): sự khác biệt giữa con cái với bố mẹ.
Câu 35. Đột biến gen được xem là nguồn nguyên liệu chủ yếu của quá trình tiến hoá vì
A): các đột biến gen thường ở trạng thái lặn.
B): so với đột biến nhiễm sắc thể chúng phổ biến hơn, ít ảnh hưởng nghiêm trọng đến sức sống và sinh sản của cơ thể.
C): tần số xuất hiện lớn.		               
D): là những đột biến lớn, dễ tạo ra các loài mới.
Câu 36. Nhân tố tiến hóa nào sau đây là nhân tố tiến hóa có hướng ?
A): Chọn lọc tự nhiên.	
B): Đột biến.	
C): Các yếu tố ngẫu nhiên.	
D): Di - nhập gen.
Câu 37. Nhân tố tiến hóa nào trong các nhân tố sau làm biến đổi nhanh nhất tần số tương đối của các alen về một gen nào đó 
A): chọn lọc tự nhiên.	  
B): đột biến.	    
C): giao phối ngẫu nhiên.	 
D): giao phối không ngẫu nhiên.
Câu 38. Trong tiến hoá, chọn lọc tự nhiên được xem là nhân tố tiến hoá cơ bản nhất vì
A): tăng cường sự phân hoá kiểu gen trong quần thể gốc
B): diễn ra với nhiều hình thức khác nhau.
C): đảm bảo sự sống sót của những cá thể thích nghi nhất.
D): nó định hướng quá trình tích luỹ biến dị, quy định nhịp độ biến đổi kiểu gen của quần thể.
Câu 39. Các alen trội bị tác động của chọn lọc tự nhiên nhanh hơn các alen lặn vì:
A): Các alen lặn phần lớn có hại		
B): Các alen trội dù ở trạng thái dị hợp vẫn biểu hiện ra kiểu hình
C): Các alen lặn thường ít gặp hơn alen trội	
D): Các alen trội thường có sự tương tác với nhau
Câu 40. Phát biểu nào sau đây không đúng về chọn lọc tự nhiên theo quan điểm di truyền hiện đại?
A): CLTN chỉ tác động ở cấp độ cá thể, không tác động ở mức độ dưới cá thể và trên cá thể.
B): Cơ thể thích nghi trước hết phải có kiểu gen phản ứng thành những kiểu hình có lợi trước môi trường.
C): CLTN sẽ tác động lên kiểu hình của cá thể qua nhiều thế hệ sẽ dẫn tới hệ quả là chọn lọc kiểu gen.
D): Chọn lọc cá thể làm tăng tỉ lệ những cá thể thích nghi nhất trong nội bộ quần thể.
Câu 41. Theo quan niệm hiện đại, cơ chế tác động của CLTN là:
A): Tác động trực tiếp lên kiểu gen và kiểu hình
B): Tác động gián tiếp lên kiểu gen và kiểu hình
C): Tác động trực tiếp lên kiểu gen và tác động gián tiếp lên kiểu hình
D): Tác động gián tiếp lên kiểu gen và tác động trực tiếp lên kiểu hình
Câu 42. Theo quan niệm hiện đại, mặt chủ yếu của chọn lọc tự nhiên là:
A): Phân hóa khả năng sống sót của những kiểu gen thích nghi trong loài
B): Phân hóa khả năng sinh sản của những kiểu gen thích nghi trong loài
C): Phân hóa khả năng sinh sản của những cá thể thích nghi trong quần thể
D): Phân hóa khả năng sinh sản của những kiểu gen thích nghi trong quần thể
Câu 43. Điều khẳng định nào dưới đây về chọn lọc tự nhiên (CLTN) là đúng hơn cả?
A): CLTN tạo nên các đặc điểm giúp sinh vật thích nghi với môi trường.
B): CLTN trực tiếp làm thay đổi tần số alen của quần thể.
C): CLTN làm thay đổi giá trị thích ứng của kiểu gen.
D): CLTN sàng lọc những biến dị có lợi, đào thải các biến dị có hại.
Câu 44. Trong các nhân tố tiến hoá sau, nhân tố có thể làm biến đổi tần số alen của quần thể một cách nhanh chóng, đặc biệt khi kích thước quần thể nhỏ bị giảm đột ngột là
A): đột biến.	
B): di nhập gen.		
C): các yếu tố ngẫu nhiên.	
D): giao phối không ngẫu nhiên.
Câu 45. Trong tiến hoá, không chỉ có các alen có lợi được giữ lại mà nhiều khi các alen trung tính, hoặc có hại ở một mức độ nào đó vẫn được duy trì trong quần thể bởi
A): quá trình giao phối.	    
B): di nhập gen.	
C): chọn lọc tự nhiên.	    
D): các yếu tố ngẫu nhiên
Câu 46. Theo quan niệm hiện đại, các yếu tố ngẫu nhiên tác động vào quần thể
A): luôn làm tăng tần số kiểu gen đồng hợp tử và giảm tần số kiểu gen dị hợp tử. 
B): làm thay đổi tần số các alen không theo một hướng xác định. 
C): luôn làm tăng tính đa dạng di truyền của quần thể. 
D): không làm thay đổi tần số các alen của quần thể. 
Câu 47. Giao phối không ngẫu nhiên  có đặc điểm gì?
A): Có thể không làm thay đổi tần số alen nhưng làm thay đổi thành phần kiểu gen của quần thể theo hướng tăng dần  tần số kiểu gen đồng hợp, giảm dần tần số kiểu gen dị hợp
B): Có thể không làm thay đổi tần số alen nhưng làm thay đổi thành phần kiểu gen của quần thể theo hướng tăng dần  tần số kiểu gen dị hợp, giảm dần tần số kiểu gen đồng hợp
C): Không làm thay đổi tần số kiểu gen và tần số alen của quần thể
D): Làm thay đổi tần số alen và tần số kiểu gen của quần thể
Câu 48. Mối quan hệ giữa quá trình đột biến và quá trình giao phối đối với tiến hoá là
A): quá trình đột biến tạo ra nguồn nguyên liệu sơ cấp còn quá trình giao phối tạo ra nguồn nguyên liệu thứ cấp.
B): đa số đột biến là có hại, quá trình giao phối trung hoà tính có hại của đột biến.
C): quá trình đột biến gây áp lực không đáng kể đối với sự thay đổi tần số tương đối của các len, quá trình giao phối sẽ tăng cường áp lực cho sự thay đổi đó.
D): quá trình đột biến làm cho một gen phát sinh thnàh nhiều alen, quá trình giao phối làm thay đổi giá trị thích nghi của một đột biến gen nào đó.
Câu 49. Trường hợp nào sau đây làm tăng độ đa dạng di truyền?
1: giao phối ngẫu nhiên			2: giao phối không ngẫu nhiên	 3: biến động di truyền 4: đột biến    		5: di nhập gen 
Phát biểu đúng là:
A): 1 và 2		
B): 2 và 4		
C): 1,4,5			
D): 1, 3, 5
Câu 50. Để phân biệt 2 cá thể thuộc cùng một loài hay thuộc hai loài khác nhau thì tiêu chuẩn nào sau đây là quan trọng nhất?
A): Cách li sinh sản	
B): Hình thái		
C): Sinh lí, sinh hoá		
D): Sinh thái
Câu 51. Khi nào ta có thể kết luận chính xác hai cá thể sinh vật nào đó thuộc hai loài khác nhau?
A): Hai cá thể đó sống trong cùng một sinh cảnh		   
B): Hai cá thể đó cách li sinh sản
C): Hai cá thể đó có nhiều đặc điểm hình thái giống nhau
D): Hai cá thể ở 2 nơi xa nhau
Câu 52. Những trở ngại ngăn cản các sinh vật giao phối với nhau được gọi là cơ chế 
A): Cách li sinh cảnh 	
B): Cách li cơ học	
C): Cách li tập tính		
D): Cách li trước hợp tử	
Câu 53. Cách li trước hợp tử gồm:
1: cách li nơi ở		2: cách li cơ học		3: cách li tập tính
4: cách li không gian		5: cách li sinh thái	               6: cách li thời gian (mùa vụ)
Phát biểu đúng là:	
A): 1,2,3		
B): 2,3,4			
C): 2,3,5		         
D): 1,2,3,6
Câu 54. Điều nào không thuộc cách li sau hợp tử?
A): Giao tử đực và giao tử cái không kết hợp với nhau được khi thụ tinh.
B): Thụ tinh được nhưng hợp tử không phát triển.
C): Hợp tử tạo thành và phát triển thành con lai sống được đến khi trưởng thành nhưng không có khả năng sinh sản.
D): Hợp tử được tạo thành và phát triển thành con lai nhưng con lai lại chết non.
Câu 55. Vai trò chủ yếu của các cơ chế cách li là:
A): ngăn ngừa sự giao phối tự do; củng cố, tăng cường sự phân hoá kiểu gen trong quần thể bị chia cắt.	
B): ngăn ngừa sự giao phối tự do giữa các cá thể của quần thể mới với quần thể gốc
C):thúc đẩy quá trình phân li tính trạng, củng cố sự phân hoá kiểu gen trong quần thể gốc
D):củng cố sự phân hoá kiểu gen trong quần thể gốc
Câu 56. Nhận định nào sau đây là đúng với quá trình hình thành loài mới?
A): Là một quá trình lịch sử, cải biến thành phần kiểu gen của quần thể ban đầu theo hướng thích nghi, tạo ra kiểu gen mới cách li sinh sản với quần thể ban đầu.
B): Là một quá trình lịch sử, cải biến thành phần kiểu gen của quần thể ban đầu theo hướng thích nghi và cách li sinh sản với các quần thể thuộc loài khác
C): Là một quá trình lịch sử, cải biến thành phần kiểu gen của quần thể ban đầu theo hướng xác định, tạo ra nhiều cá thể mới có kiểu hình mới cách li sinh sản với quần thể ban đầu.
D): Là một quá trình lịch sử dưới tác động của môi trường tạo ra những quần thể mới cách li sinh sản với quần thể ban đầu.
Câu 57. Phát biểu nào sau đây là đúng khi nói về quá trình hình thành loài mới?
A): Sự hình thành loài mới không liên quan đến quá trình phát sinh các đột biến
B): Quá trình hình thành quần thể thích nghi không nhất thiết dẫn đến hình thành loài mới
C): Sự cách li địa lí tất yếu dẫn đến sự hình thành loài mới.
D): Quá trình hình thành quần thể thích nghi luôn dẫn đến hình thành loài mới
Câu 58. Phương thức hình thành loài khác khu thể hiện ở con đường hình thành loài nào?
A): Con đường cách li tập tính.		
B): Con đường địa lí.	
C): Con đường sinh thái.			
D): Con đường lai xa và đa bội hoá (đa bội khác nguồn).
Câu 59. Trong quá trình tiến hoá, sự cách li địa lí có vai trò
A): hạn chế sự giao phối tự do giữa các cá thể thuộc các quần thể cùng loài.
B): hạn chế sự giao phối tự do giữa các cá thể thuộc các quần thể khác loài.
C): là điều kiện làm biến đổi kiểu hình của sinh vật theo hướng thích nghi.
D): tác động làm biến đổi kiểu gen của cá thể và vốn gen của quần thể.
Câu 60. Vai trò của chọn lọc tự nhiên trong quá trình hình thành loài mới bằng con đường địa lí là
A): Tích luỹ những biến dị có lợi và đào thải những biến dị có hại dần dần hình thành nòi mới.
B): Tích luỹ những đột biến và biến dị tổ hợp theo những hướng khác nhau, dần dần tạo thành nòi địa lí rồi tới các loài mới.
C): Nhân tố gây ra sự phân ly tính trạng tạo ra nhiều nòi mới.
D): Nhân tố gây ra sự biến đổi tương ứng trên cơ thể sinh vật.
Câu 61. Phát biểu nào sau đây không đúng về quá trình hình thành loài mới bằng con đường địa lí
A): Hình thành loài mới bằng con đường địa lí diễn ra chậm chạp trong thời gian lịch sử lâu dài.
B): Trong những điều kiện địa lí khác nhau, chọn lọc tự nhiên đã tích luỹ các đột biến và biến dị tổ hợp theo những hướng khác nhau.
C): Hình thành loài mới bằng con đường địa lí thường gặp ở cả động vật và thực vật.
D): Điều kiện địa lí là nguyên nhân trực tiếp gây ra những biến đổi tương ứng trên cơ thể sinh vật, từ đó tạo ra loài mới.
Câu 62. Quần đảo là nơi lý tưởng cho quá trình hình thành loài mới vì
A): các đảo cách xa nhau nên các sinh vật giữa các đảo không trao đổi vốn gen cho nhau.
B): rất dễ xảy ra hiện tượng du nhập gen.
C): giữa các đảo có sự cách li địa lý tương đối và khoảng cách giữa các đảo lại không quá lớn.
D): chịu ảnh hướng rất lớn của các yếu tố ngẫu nhiên.
Câu 63. Trong các con đường hình thành loài sau, con đường hình thành loài nhanh nhất và phổ biến ở thực vật là bằng con đường
A): địa lý.	
B): sinh thái.		
C): lai xa và đa bội hoá.		
D): đột biến lớn.
Câu 64. Từ quần thể cây 2n, người ta tạo được quần thể cây 4n, có thể xem quần thể cây 4n là một loài mới vì quần thể cây 4n 
A): có sự khác biệt với quần thể cây 2n về số NST	
B): không thể giao phấn với cây của quần thể 2n.
C): giao phối được với các cây của quần thể cây 2n cho ra cây lai bất thụ.
D): có đặc điểm hình thái: kích thứơc các cơ quan sinh dưỡng lớn hơn hẳn cây của quần thể 2n.
Câu 65. Hình thành loài bằng đa bội hóa khác nguồn thường gặp ở thực vật, ít gặp ở động vật vì ở động vật:
A): Đa bội hóa thường gây những rối loạn về giới tính và cơ chế cách li sinh sản giữa các loài rất phức tạp
B): Đa bội hóa thường gây những rối loạn về phân bào và cơ chế cách li sinh sản giữa các loài rất phức tạp
C): Đa bội hóa thường gây những rối loạn về giới tính và cơ chế sinh sản của các loài rất phức tạp
D): Đa bội hóa thường gây những rối loạn về phân bào và cơ chế sinh sản của các loài rất phức tạp
CHỦ ĐỀ 9: CÁ THỂ VÀ QUẦN THỂ SINH VẬT
Câu 1. Khái niệm môi trường nào sau đây là đúng?
A): Môi trường là nơi sống của sinh vật, bao gồm tất cả các nhân tố vô sinh và hữu sinh ở xung quanh sinh vật, có tác động trực tiếp, gián tiếp tới sinh vật.
B): Môi trường bao gồm tất cả các nhân tố ở xung quanh sinh vật, có tác động trực tiếp, gián tiếp tới sinh vật, làm ảnh hưởng tới sự tồn tại, sinh trưởng, phát triển và những hoạt động khác của sinh vật.
C): Môi trường là nơi sống của sinh vật, bao gồm tất cả các nhân tố vô sinh xung quanh sinh vật.
D): Môi trường là nơi sống của sinh vật, bao gồm tất cả các nhân tố hữu sinh ở xung quanh sinh vật.
Câu 2. Các nhân tố sinh thái là
A): tất cả các yếu tố xung quanh sinh vật, ảnh hưởng trực tiếp hoặc gián tiếp tới đời sống của sinh vật.
B): tất cả các nhân tố vật lí và hoá học của môi trường xung quanh sinh vật (nhân tố vô sinh).
C): những mối quan hệ giữa một sinh vật (hoặc nhóm sinh vật) này với một sinh vật (hoặc nhóm sinh vật) khác sống xung quanh (nhân tố hữu sinh).
D): những tác động của con người đến môi trường.
Câu 3. Có các loại môi trường sống chủ yếu của sinh vật là môi trường
A): trong đất, môi trường trên cạn, môi trường dưới nước
B): vô sinh, môi trường trên cạn, môi trường dưới nước
C): trong đất, môi trường trên cạn, môi trường nước ngọt, nước mặn.
D): trong đất, môi trường trên cạn, môi trường dưới nước, môi trường sinh vật.
Câu 4. Giới hạn sinh thái là 
A): khoảng xác định của nhân tố sinh thái, ở đó loài có thể sống tồn tại và phát triển ổn định theo thời gian.
B): khoảng xác định ở đó loài sống thuận lợi nhất, hoặc sống bình thường nhưng năng lượng bị hao tổn tối thiểu.
C): khoảng chống chịu ở đó đời sống của loài ít bất lợi.     D): khoảng cực thuận, ở đó loài sống thuận lợi nhất 
Câu 5. Quy luật giới hạn sinh thái có ý nghĩa
A): đối với sự phân bố của sinh vật trên trái đất, ứng dụng trong việc di nhập vật nuôi.
B): ứng dụng trong việc di nhập, thuần hoá các giống vật nuôi, cây trồng trong nông nghiệp.
C): đối với sự phân bố của sinh vật trên trái đất, trong việc di nhập, thuần hoá các giống vật nuôi, cây trồng trong nông nghiệp.
D): Đối với sự phân bố của sinh vật trên trái đất, thuần hoá các giống vật nuôi.
Câu 6. Khoảng thuận lợi là khoảng các nhân tố sinh thái
A): ở đó sinh vật sinh sản tốt nhất.	
B): ở mức phù hợp nhất để sinh vật thực hiện chức năng sống tốt nhất.
C): giúp sinh vật chống chịu tốt nhất với môi trường. 	      
D): ở đó sinh vật sinh trưởng, phát triển tốt nhất.
Câu 7. Cá rô phi nuôi ở nước ta có giới hạn sinh thái từ 5,60C đến 420C): Điều giải thích nào dưới đây là đúng?
A): nhiệt độ 5,60C gọi là giới hạn dưới, 420C gọi là giới hạn trên.
B): nhiệt độ 5,60C gọi là giới hạn dưới, > 420C gọi là giới hạn trên.
C): nhiệt độ < 5,60C gọi là giới hạn dưới, 420C gọi là giới hạn trên.
D): nhiệt độ 5,60C gọi là giới hạn trên, 420C gọi là giới hạn dưới.
Câu 8. Ổ sinh thái là
A): khu vực sinh sống của sinh vật.
B): nơi thường gặp của loài.
C): khoảng không gian sinh thái có tất cả các điều kiện quy định cho sự tồn tại, phát triển ổn định lâu dài của loài.
D): nơi có đầy đủ các yếu tố thuận lợi cho sự tồn tại của sinh vật
Câu 9. Sự phân hóa ổ sinh thái của sinh vật có tác dụng:
A): Giảm độ đa dạng của sinh vật			
B): Giảm sự phân hóa về mặt hình thái của sinh vật.
C): Tăng mức độ cạnh tranh giữa các loài.		
D): Giảm mức độ cạnh tranh giữa các loài.
Câu 10. Ánh sáng ảnh hưởng tới đời sống thực vật, làm
A): thay đổi đặc điểm hình thái, cấu tạo giải phẫu, sinh lí của thực vật, hình thành các nhóm cây ưa sáng, ưa bóng.
B): tăng hoặc giảm sự quang hợp của cây.
C): thay đổi đặc điểm hình thái, sinh lí của thực vật.
D): ảnh hưởng tới cấu tạo giải phẫu, sinh sản của cây.
Câu 11. Ánh sáng ảnh hưởng tới đời sống động vật 
A): hoạt động kiếm ăn, tạo điều kiện cho động vật nhận biết các vật, định hướng di chuyển trong không gian.
B): đã ảnh hưởng tới hoạt động, khả năng sinh trưởng, sinh sản.
C): hoạt động kiếm ăn, khả năng sinh trưởng, sinh sản.
D): ảnh hưởng tới hoạt động, khả năng sinh trưởng, sinh sản, tạo điều kiện cho động vật nhận biết các vật, định hướng di chuyển trong không gian.
Câu 12. Đặc điểm nào sau đây không có ở cây ưa bóng?
A): Phiến lá dày, mô giậu phát triển.	
B): Thân cây có vỏ mỏng, màu sẫm.
C): Lá nằm ngang.			
D): Lá cây có màu xanh sẫm, hạt lục lạp có kích thước lớn.
Câu 13. Ở động vật đồng nhiệt (hằng nhiệt) sống ở vùng ôn đới lạnh có
A): các phần thò ra (tai, đuôi) to ra, còn kích thước cơ thể lớn hơn so với những loài tương tự sống ở vùng nhiệt đới.
B): các phần thò ra (tai, đuôi) nhỏ lại, còn kích thước cơ thể lại nhỏ hơn so với những loài tương tự sống ở vùng nhiệt đới.
C): các phần thò ra (tai, đuôi) nhỏ lại, còn kích thước cơ thể lại lớn hơn so với những loài tương tự sống ở vùng nhiệt đới.
D): các phần thò ra (tai, đuôi) to ra, còn kích thước cơ thể lại nhỏ hơn so với những loài tương tự sống ở vùng nhiệt đới.
Câu 14. Những đặc điểm nào có thể có ở một quần thể sinh vật?
1. Quần thể bao gồm nhiều cá thể sinh vật.
2. Quần thể là tập hợp của các cá thể cùng loài.
3. Các cá thể trong quần thể có khả năng có khả năng sinh sản tạo thế hệ mới.
4. Quần thể gồm nhiều cá thể cùng loài phân bố ở các nơi xa nhau.
5. Các cá thể trong quần thể có kiểu gen hoàn toàn giống nhau.
6. cùng sống trong 1 khoảng không gian xác định, vào một thời điểm xác định
	Tổ hợp câu đúng là
A): 1, 2, 3.		
B): 2, 3, 6.		
C): 3, 4, 5.		
D): 4, 5, 6.
Câu 15. Ví dụ nào sau đây là quần thể?
A): Các cá thể rắn hổ mang sống ở 3 hòn đảo cách xa nhau.
B): Tập hợp các cá thể cá chép, cá mè, cá rô phi sống chung trong một ao.
C): Rừng cây thông nhựa phân bố tại vùng núi Đông Bắc Việt Nam.
D): Tập hợp các cá thể rắn hổ mang, cú mèo và lợn rừng sống trong một rừng mưa nhiệt đới.
Câu 16. Kết quả của quá trình hình thành quần thể như thế nào?
A): Giữa các cá thể cùng loài chỉ hình thành những mối quan hệ hỗ trợ, chúng tập hợp lại thành quần thể ổn định, thích nghi với điều kiện ngoại cảnh.
B): Giữa các cá thể cùng loài chỉ hình thành những mối quan hệ, chúng tập hợp lại thành quần thể ổn định, thích nghi với điều kiện ngoại cảnh.
C): Giữa các cá thể cùng loài chỉ hình thành những mối quan hệ hoặc hỗ trợ hoặc cạnh tranh lẫn nhau, chúng tập hợp lại thành quần thể ổn định, chưa thích nghi hoàn toàn với điều kiện ngoại cảnh.
D): Giữa các cá thể cùng loài gắn bó chặt chẽ với nhau thông qua các mối quan hệ sinh thái và dần dần hình thành quần thể ổn định, thích nghi với điều kiện ngoại cảnh.
Câu 17. Mối quan hệ nào là phổ biến nhất trong quần thể ?
A): Quan hệ hỗ trợ      
B): Quan hệ cạnh tranh      
C): Quan hệ kí sinh cùng loài     
D): Quan hệ ăn thịt đồng loại
Câu 18. Điều nào sau đây không đúng đối với vai trò của quan hệ hỗ trợ?
A): Đảm bảo cho quần thể tồn tại ổn định.	
B): Khai thác tối ưu nguồn sống của môi trường.
C): Tạo nguồn dinh dưỡng cho quần thể.		
D): Làm tăng khả năng sống sót và sinh sản của quần thể.
Câu 19. Thực vật sống thành nhóm có lợi gì so với sống riêng lẻ ?
A): Làm giảm nhiệt độ không khí cho cây.	
B): Giữ được độ ẩm của đất.
C): Thuận lợi cho sự thụ phấn.			
D): Giảm bớt sức thổi của gió, giảm thoát hơi nước, trao đổi chất nhanh.
Câu 20. Ý nào không đúng đối với động vật sống thành bầy đàn trong tự nhiên?
A): Có lợi trong việc tìm kiếm thức ăn.		
B): Phát hiện kẻ thù nhanh hơn.
C): Tự vệ tốt hơn.				
D): Thường xuyên diễn ra sự cạnh tranh.
Câu 21. Sự điều chỉnh mật độ cá thể của quần thể theo xu hướng nào?
A): Quần thể luôn có xu hướng tăng số lượng cá thể ở mức tối đa tạo thuận lợi cho sự tồn tại và phát triển trước những tai biến của tự nhiên.
B): Quần thể luôn có xu hướng giảm số lượng cá thể tạo thuận lợi cho sự cân bằng với khả năng cung cấp nguồn sống của môi trường.
C): Quần thể luôn có xu hướng tự điều chỉnh tăng hoặc giảm số lượng cá thể tuỳ thuộc vào khả năng cung cấp nguồn sống của môi trường.
D): Quần thể luôn có xu hướng điều chỉnh về trạng thái cân bằng: số lượng cá thể ổn định và cân bằng với khả năng cung cấp nguồn sống của môi trường
Câu 22. Quan hệ cạnh tranh giữa các cá thể trong quần thể xảy ra khi
A): vào mùa sinh sản của quần thể.
B): khi quần thể có nhiều cá thể bị đánh bắt quá mứC):
C): mật độ các cá thể quá cao, các cá thể tranh giành nhau nguồn sống, con đực tranh giành con cái.
D): khi các cá thể phân bố đồng đều trong không gian của quần thể.
Câu 23. Hiện tượng tự tỉa của thực vật là hiện tượng thể hiện mối quan hệ:
A): Ức chế - cảm nhiễm.			
B): Cạnh tranh khi thiếu ánh sáng, chất dinh dưỡng.
C): Sự cố bất thường			
D): Ngăn ngừa sự gia tăng cá thể.
Câu 24. Quan hệ đối kháng giữa các cá thể cùng loài gồm:
A): cạnh tranh cùng loài, kí sinh cùng loài	          
B): cạnh tranh cùng loài, ăn thịt đồng loại
C): cạnh tranh cùng loài, kí sinh cùng loài, ăn thịt đồng loại        
D): ăn thịt đồng lọai, kí sinh cùng loài, ức chế cảm nhiễm
Câu 25. Phát biểu nào sau đây là không đúng ?
A): Cạnh tranh thường xuất hiện khi mật độ cá thể trong quần thể tăng quá cao
B): Quan hệ cạnh tranh càng gay gắt thì các cá thẻ trong quần thể trở nên đối kháng
C): Quan hệ cạnh tranh dẫn đến làm thay đổi mật độ phân bố của các cá thể trong quần thể
D): Cạnh tranh không phải là đặc điểm thích nghi của quần thể
Câu 26. Khi mật độ trong quần thể cao quá thì
1. Có sự cạnh tranh gay gắt về nơi ở    2. Tỉ lệ tử vong cao	  3. Mức sinh sản tăng  4. Xuất cư tăng
Phương án trả lời đúng là
A): 1,2,3	
B): 1,2,3,4	
C): 2,3,4			
D): 1,2,4
Câu 27. Điều nào sau đây không đúng đối với vai trò của quan hệ cạnh tranh?
A): Đảm bảo sự tăng số lượng không ngừng của quần thể.
B): Đảm bảo số lượng của các cá thể trong quần thể duy trì ở mức độ phù hợp.
C): Đảm bảo sự tồn tại và phát triển của quần thể.
D): Đảm bảo sự phân bố của các cá thể trong quần thể duy trì ở mức độ phù hợp.
Câu 28. Tỉ lệ giới tính thay đổi, không chịu ảnh hưởng của yếu tố nào sau đây?
A): Điều kiện sống của môi trường.					
B): Mật độ cá thể của quần thể.
C): Mùa sinh sản, đặc điểm sinh sản, sinh lí và tập tính của sinh vật.	
D): Điều kiện dinh dưỡng.
Câu 29. Sự hiểu biết về tỉ lệ giới tính của quần thể sinh vật có ý nghĩa:
A): Tạo sự cách li sinh sản				
B): Điều chỉnh tỉ lệ đực cái cho phù hợp
C): Tạo điều kiện sinh sản với tốc độ nhanh		
D): Giữ tỉ lệ giới tính trong quần thể là 1:1
Câu 30. Quần thể thông thường có những nhóm tuối nào?
A): Nhóm trước sinh sản và nhóm sau sinh sản.	     
B): Nhóm trước sinh sản và nhóm đang sinh sản.
C): Nhóm còn non và nhóm trưởng thành.	      
D): Nhóm trước sinh sản, nhóm đang sinh sản và nhóm sau sinh sản.
Câu 31. Không có khái niệm tuổi nào sau đây?
A): Tuổi loài là tuổi trung bình của các cá thể trong loài.
B): Tuổi quần thể là tuổi trung bình của các cá thể trong quần thể.
C): Tuổi sinh thái là khoảng thời gian sống của cá thể cho đến khi chết vì những nguyên nhân sinh thái.
D): Tuổi sinh lí là khoảng thời gian tồn tại của cá thể từ lúc sinh cho đến khi chết vì già.
Câu 32. Trong tháp tuổi của quần thể trẻ có
A): nhóm tuổi trước sinh sản bé hơn các nhóm tuổi còn lại.
B): nhóm tuổi trước sinh sản bằng các nhóm tuổi còn lại.
C): nhóm tuổi trước sinh sản lớn hơn các nhóm tuổi còn lại.
D): nhóm tuổi trước sinh sản chỉ lớn hơn nhóm tuổi sau sinh sản.
Câu 33. Quần thể bị diệt vong khi mất đi một số nhóm trong các nhóm tuổi
A): đang sinh sản và sau sinh sản.		
B): đang sinh sản.
C): trước sinh sản và sau sinh sản.		
D): trước sinh sản và đang sinh sản.
Câu 34. Nghiên cứu thành phần nhóm tuổi của quần thể có ý nghĩa:
A): Hiểu được sự phát triển hay diệt vong.     	
B): Bảo vệ và khai thác có hiệu quả nguồn tài nguyên 
C): Chủ động cung cấp nguồn sống cho quần thể.
D): Điều chỉnh số lượng đực cái phù hợp đảm bảo sự phát triển của quần thể.
Câu 35. Các loài trong quần xã phân bố theo dạng:
A): phân bố đồng đều, theo nhóm, ngẫu nhiên         
B): phân bố theo nhóm , ngẫu nhiên
C): phân bố đồng đều, theo chiều thẳng đứng          
D): phân bố theo chiều thẳng đứng, theo mặt phẳng ngang
Câu 36. Phân bố theo nhóm là
A): dạng phân bố ít phổ biến, gặp trong điều kiện môi trường không đồng nhất, các cá thể thích sống tụ họp với nhau.
B): dạng phân bố rất phổ biến, gặp trong điều kiện môi trường không đồng nhất, các cá thể sống tụ họp với nhau ở những nơi có điều kiện tốt nhất.
C): dạng phân bố rất phổ biến, gặp trong điều kiện môi trường đồng nhất, các cá thể thích sống tụ họp với nhau.
D): dạng phân bố rất phổ biến, gặp trong điều kiện môi trường không đồng nhất, các cá thể không thích sống tụ họp với nhau.
Câu 37. Các cá thể trong quần thể phân bố theo nhóm có ý nghĩa sinh thái:
A): Các cá thể cạnh tranh nhau về thức ăn, đực cái…
B): Sinh vật tận dụng nguồn sống tiềm tang trong môi trưồng sống
C): Đảm bảo khả năng sinh sản của các cá thể.
D): Các cá thể hỗ trợ lẫn nhau, chống lại điều kiện bất lợi của môi trường.
Câu 38. Hình thức phân bố cá thể đồng đều trong quần thể có ý nghĩa sinh thái gì?
A): Các cá thể hỗ trợ nhau chống chọi với điều kiện bất lợi của môi trường.
B): Các cá thể tận dụng được nhiều nguồn sống từ môi trường.
C): Giảm sự cạnh tranh gay gắt giữa các cá thể.
D): Các cá thể cạnh tranh nhau gay gắt giành nguồn sống.
Câu 39. Mật độ cá thể của quần thể là
A): số lượng cá thể trên một đơn vị diện tích của quần thể.
B): khối lượng cá thể trên một đơn vị diện tích hay thể tích của quần thể.
C): số lượng cá thể trên một đơn vị diện tích hay thể tích của quần thể.
D): số lượng cá thể trên một đơn vị thể tích của quần thể.
Câu 40. Mật độ cá thể trong quần thể có ảnh hưởng tới
A): khối lượng nguồn sống trong môi trường phân bố của quần thể.
B): mức độ sử dụng nguồn sống, khả năng sinh sản và tử vong của quần thể.
C): hình thức khai thác nguồn sống của quần thể.
D): tập tính bầy đàn và hình thức di cư các cá thể trong quần thể.
Câu 41. Mật độ cá thể có ảnh hưởng đến các mối quan hệ trong quần thể như thế nào?
A): Khi mật độ cá thể trong quần thể tăng quá cao, các cá thể cạnh tranh nhau gay gắt; khi mật độ giảm, các cá thể trong quần thể tăng cường hỗ trợ lẫn nhau.
B): Khi mật độ cá thể trong quần thể tăng quá cao, các cá thể ít cạnh tranh nhau; khi mật độ giảm, các cá thể trong quần thể tăng cường hỗ trợ lẫn nhau.
C): Khi mật độ cá thể trong quần thể tăng quá cao, các cá thể cạnh tranh nhau gay gắt; khi mật độ giảm, các cá thể trong quần thể ít hỗ trợ lẫn nhau.
D): Khi mật độ cá thể trong quần thể tăng quá cao, các cá thể ít cạnh tranh nhau; khi mật độ giảm, các cá thể trong quần thể ít hỗ trợ lẫn nhau.
Câu 42. Kích thước của quần thể là
A): số lượng cá thể, khối lượng hoặc năng lượng tích luỹ trong các cá thể phân bố trong khoảng không gian của quần thể.
B): Khối lượng các cá thể phân bố trong khoảng không gian của quần thể.
C): năng lượng tích luỹ trong các cá thể phân bố trong khoảng không gian của quần thể.
D): số lượng cá thể phân bố trong khoảng không gian của quần thể.
Câu 43. Kích thước của quần thể thay đổi không phụ thuộc vào yếu tố nào sau đây?
A): Sức sinh sản.					
B): Mức độ tử vong.
C): Cá thể nhập cư và xuất cư.			
D): Tỉ lệ đực, cái.
Câu 44. Số lượng cá thể của quần thể tăng cao khi
A): trong điều kiện môi trường thuận lợi, sức sinh sản của quần thể tăng lên và mức độ tử vong giảm, nhập cư cũng có thể tăng.
B): trong điều kiện môi trường thuận lợi, sức sinh sản của quần thể tăng lên và mức độ tử vong tăng, nhập cư cũng có thể tăng.
C): trong điều kiện môi trường thuận lợi, sức sinh sản của quần thể tăng lên và mức độ tử vong giảm, xuất cư cũng có thể tăng.
D): trong điều kiện môi trường thuận lợi, sức sinh sản của quần thể tăng lên và mức độ tử vong giảm, nhập cư cũng có thể giảm.
Câu 45. Kích thước của quần thể dao động từ giá trị tối thiểu tới tối đa được hiểu như thế nào?
A): Kích thước tối thiểu là số lượng cá thể ít nhất trong thời gian tồn tại của quần thể. Kích thước tối đa là giới hạn cuối cùng về số lượng mà quần thể có thể đạt được, cân bằng với khả năng cung cấp nguồn sống của môi trường.
B): Kích thước tối thiểu là số lượng cá thể ít nhất mà quần thể cần có để duy trì và phát triển. Kích thước tối đa là giới hạn cuối cùng về số lượng mà quần thể có thể đạt được, vượt ra ngoài khả năng cung cấp nguồn sống của môi trường.
C): Kích thước tối thiểu là số lượng cá thể ít nhất mà quần thể cần có để duy trì và phát triển. Kích thước tối đa là giới hạn cuối cùng về số lượng mà quần thể có thể đạt được, cân bằng với khả năng cung cấp nguồn sống của môi trường.
D): Kích thước tối thiểu là số lượng cá thể ít nhất mà quần thể không thể duy trì và phát triển. Kích thước tối đa là giới hạn cuối cùng về số lượng mà quần thể có thể đạt được, vượt ra ngoài khả năng cung cấp nguồn sống của môi trường.
Câu 46. Điều nào không phải là nguyên nhân khi kích thước xuống dưới mức tối thiểu, quần thể dễ rơi vào trạng thái suy giảm dẫn tới diệt vong?
A): Số lượng cá thể của quần thể quá ít, sự hỗ trợ giữa các cá thể bị giảm, quần thể không có khả năng chống chọi với những thay đổi của môi trường.
B): Khả năng sinh sản suy giảm do cơ hội tìm gặp của các cá thể đực với các cá thể cái ít.
C): Số lượng cá thể quá ít nên sự giao phối cận huyết thường xảy ra, sẽ dẫn đến suy thoái quần thể.
D): Mật độ cá thể bị thay đổi, làm giảm nhiều khả năng hỗ trợ về mặt dinh dưỡng giữa các cá thể trong quần thể.
Câu 47. Nhân tố mang tính quyết định đến sự tăng trưởng kích thước của quần thể:
A): mức sinh sản        
B): mức tử vong          
C): mức nhập cư và xuất cư	   
D): mức sinh sản và tử vong
Câu 48. Quần thể tăng trưởng theo tiềm năng sinh học khi
A): môi trường có nguồn sống dồi dào, thoả mãn mọi khả năng sinh học của các cá thể trong quần thể.
B): môi trường có nguồn sống dồi dào, cung cấp đầy đủ thức ăn cho các cá thể trong quần thể.
C): môi trường có nguồn sống dồi dào, không gian cư trú của quần thể không giới hạn, không có kẻ thù, không có sinh vật gây bệnh
D): môi trường có nguồn sống dồi dào, cung cấp đầy đủ thức ăn, nước uống và nơi trú ẩn của các cá thể trong quần thể.
Câu 49. Điều nào dưới đây không đúng đối với quần thể khi môi trường không bị giới hạn?
A): Mức sinh sản của quần thể là tối đa		
B): Mức tử vong là tối đa
C): Mức tử vong là tối thiểu.			
D): Mức tăng trưởng là tối đa
Câu 50. Trong điều kiện môi trường bị giới hạn, sự tăng trưởng kích thước của quần thể theo đường cong tăng trưởng thực tế có hình chữ S, ở giai đoạn ban đầu, số lượng cá thể tăng chậm. Nguyên nhân chủ yếu của sự tăng chậm số lượng cá thể là do
A): kích thước của quần thể còn nhỏ.
B): nguồn sống của môi trường cạn kiệt.
C): số lượng cá thể của quần thể đang cân bằng với sức chịu đựng (sức chứa) của môi trường.
D): sự cạnh tranh giữa các cá thể trong quần thể diễn ra gay gắt.
Câu 51. Trong quần thể người, tăng dân số quá nhanh dẫn tới:
A): Chất lượng môi trường giảm, ảnh hưởng tới cuộc sống con người
B): Sức lao động dồi dào, tạo ra nhiều sản phẩm trong xã hội, chất lượng cuộc sống được nâng cao.
C): Dân số tăng trưởng nhanh chóng, kinh tế phát triển mạnh
D): Sản phẩm xã hội làm ra nhiều, chất lượng môi trường giảm.
Câu 52. Các dạng biến động số lượng cá thể của quần thể là
1. Biến động theo chu kì			2. Biến động không theo chu kì
3. Biến động nửa theo chu kì, nửa không theo chu kì	4. Biến động tự do
Phương án trả lời đúng là
A): 1,2,3	
B): 1,2	
C): 1,2,4				
D): 1,2,3,4
Câu 53. Biến động không theo chu kì về số lượng cá thể của quần thể là
A): sự tăng một cách đột ngột do điều kiện bất thường của các nhân tố môi trường tạo nên.
B): sự giảm một cách đột ngột do điều kiện bất thường của các nhân tố môi trường tạo nên.
C): sự tăng hoặc giảm một cách đột ngột do điều kiện bất thường của các nhân tố vô sinh của môi trường tạo nên.
D): sự tăng hoặc giảm một cách đột ngột do điều kiện bất thường của các nhân tố môi trường tạo nên.
Câu 54. Vì sao có sự biến động số lượng cá thể trong quần thể theo chu kì?
A): Do những thay đổi có chu kì của điều kiện môi trường.
B): Do sự tăng giảm nguồn dinh dưỡng có tính chu kì.
C): Do sự thay đổi thời tiết có tính chu kì.
D): Do sự sinh sản có tính chu kì.
Câu 55. Sự biến động số lượng ruồi muỗi diễn ra hàng năm theo chu kì nào?
A): mùa		
B): ngày đêm		
C): tuần trăng			
D): nhiều năm.
Câu 55. Trạng thái cân bằng của quần thể là trạng thái số lượng cá thể ổn định do
A): sức sinh sản giảm, sự tử vong giảm.		
B): sức sinh sản tăng, sự tử vong giảm.
C): sức sinh sản giảm, sự tử vong tăng.		
D): sự tương quan giữa tỉ lệ sinh và tỉ lệ tử
Câu 56. Điều nào không đúng đối với sự biến động số lượng có tính chu kì của các loài ở Việt Nam?
A): Sâu hại xuất hiện nhiều vào các mùa xuân, hè.
B): Chim cu gáy thường xuất hiện nhiều vào thời gian thu hoạch lúa, ngô hàng năm.
C): Muỗi thường có nhiều khi thời tiết ấm áp và độ ẩm cao.
D): Ếch nhái có nhiều vào mùa khô.
Câu 57. Số lượng cá thể của quần thể biến động là do
A): chu kì của điều kiện môi trường.
B): quần thể luôn có xu hướng tự điều chỉnh số lượng cá thể.
C): các cá thể trong quần thể luôn cạnh tranh nhau ảnh hưởng tới khả năng sinh sản, tử vong của quần thể.
D): những thay đổi của các nhân tố sinh thái vô sinh và nhân tố sinh thái hữu sinh của môi trường.
Câu 58. Các nhân tố sinh thái không phụ thuộc mật độ của quần thể là
A): sự cạnh tranh giữa các cá thể trong cùng một đàn, số lượng kẻ thù ăn thịt.
B): ánh sáng, nhiệt độ, độ ẩm.
C): sức sinh sản và mức độ tử vong.
D): sự xuất nhập của các cá thể trong quần thể.
`;

function start() {
    qss = [];
    document.getElementById("res").innerHTML = "";
    document.getElementById("qmain").innerHTML = "";
    renderQ(lgen())
}