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
    a = k.match(/(?<=(A\)\:))(.)*(?=(( )*B\)\:|\n( )*?B))/gm).map(e=>e.replace(/\s+/g,' ').trim()).filter(xx => xx!=="");
    b = k.match(/(?<=(B\)\:))(.)*(?=(( )*C\)\:|\n( )*?C))/gm).map(e=>e.replace(/\s+/g,' ').trim()).filter(xx => xx!=="");
    c = k.match(/(?<=(C\)\:))(.)*(?=(( )*D\)\:|\n( )*?D))/gm).map(e=>e.replace(/\s+/g,' ').trim()).filter(xx => xx!=="");
    d = k.match(/(?<=(D\)\:))(.)*(?=\n)/gm).map(e=>e.replace(/\s+/g,' ').trim()).filter(xx => xx!=="");
    //console.log(d);
    af = []
    for (let i = 0; i<a.length; i++) {
        af[i] = [[a[i], 0],[b[i], 1],[c[i], 2],[d[i],3]]
    }
    //console.log(b); //console.log(c);
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
    //console.log(as)
    ////console.log(ks)
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

let ss = [65, 28, 70, 33, 42, 28, 65, 28, 59, 73],
    cc = 3;
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
    //console.log(que);
    for (let i = 0; i<que.length; i++) {
        //console.log(que[i][0])
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
    let ansarr = new Array(cc*ss.length)
    for (let i = 0; i<cc*ss.length; i++) {
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
    //console.log(qss)
    ansarr.forEach((e, i) => {
        //console.log(i);
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

const an = "BBBCDDACDDACCDCABDBDDBDDCABAABBAABDAACADDAAACCDDAADDBCBDDACDBBACBADAACADACBBCDBAADDABDABAACDDADAACBCAACCACBCBABABCABBACCAAABDCACADBCABBDCDABDAABBDBDDACBDABABBBDCACBBCBDDBBBDCADAADBCBDCBBCDCDBBACCCDBACBADACACDCDBDACDDBCDACDABCBDDDDBBACABBAAAACBABADDBADABABDBDDCADDBBBBADCABAACAAABCDAAACAABADBAABADDCBABAADBADDDCDBAACABDDAAABBABDCCCAABBACDACBCBDBBDDDBAAABAAADBAAADACBACDADACBCDACDDDCBCDDABBDACDBABDCCBAADACDDCBAABDADDDBABBDBDABBBBBDCBACCCDCDDABBBCBDBBCDDBCDCBBCDCADBDADADBBBBDABADCBBDBCBBDADAA"


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
Câu 9. Quá trình tự nhân đôi của ADN có các đặc điểm: 1. Diễn ra ở trong nhân, tại kì trung gian của quá trình phân bào; 2. Diễn ra theo nguyên tắc bổ sung và nguyên tắc bán bảo toàn; 3. Cả hai mạch đơn đều làm khuôn để tổng hợp mạch mới; 4. Đoạn okazaki được tổng hợp theo chiều 5’   3’; 5 . Khi một phân tử ADN tự nhân đôi 2 mạch mới được tổng hợp đều được kéo dài liên tục với sự phát triển của chạc chữ Y; 6. Qua một lần nhân đôi tạo ra hai ADN con có cấu trúc giống ADN mẹ. Phương án đúng là:
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
Câu 25. Cho các sự kiện diễn ra trong quá trình phiên mã: (1) ARN pôlimeraza bắt đầu tổng hợp mARN tại vị trí đặc hiệu (khởi đầu phiên mã); (2) ARN pôlimeraza bám vào vùng điều hòa làm gen tháo xoắn để lộ ra mạch gốc có chiều 3’→5’; (3) ARN pôlimeraza trượt dọc theo mạch mã gốc trên gen có chiều 3’→5’; (4) Khi ARN pôlimeraza di chuyển tới cuối gen, gặp tín hiệu kết thúc thì nó dừng phiên mã. Trong quá trình phiên mã, các sự kiện trên diễn ra theo trình tự đúng là:
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
Câu 31. Cho các sự kiện diễn ra trong quá trình dịch mã ở tế bào nhân thực như sau: (1) Bộ ba đối mã của phức hợp Met – tARN (UAX) gắn bổ sung với côđon mở đầu (AUG) trên Marn; (2) Tiểu đơn vị lớn của ribôxôm kết hợp với tiểu đơn vị bé tạo thành ribôxôm hòan chỉnh; (3) Tiểu đơn vị bé của ribôxôm gắn với mARN ở vị trí nhận biết đặc hiệu. (4) Côđon thứ hai trên mARN gắn bổ sung với anticôđon của phức hệ aa¬1¬ – tARN (aa¬1¬: axit amin gắn liền sau axit amin mở đầu). (5) Ribôxôm dịch đi một côđon trên mARN theo chiều 5’   3’. (6) Hình thành liên kết peptit giữa axit amin mở đầu và aa¬1¬. Thứ tự đúng của các sự kiện diễn ra trong giai đoạn mở đầu và giai đoạn kéo dài chuỗi pôlipeptit là:
A): (1)  (3)  (2)  (4)  (6)  (5).	
B):  (3)  (1)  (2)  (4)  (6)  (5).
C): (2)  (1)  (3)  (4)  (6)  (5).	
D): (5)  (2)  (1)  (4)  (6)  (3).
Câu 32. Trong quá trình dịch mã, hoạt động của polyribôxôm giúp
A): nâng cao hiệu suất tổng hợp prôtêin.	   
B): các ribôxôm hỗ trợ nhau trong quá trình dịch mã.
C): không ribôxôm này thì ribôxôm khác sẽ tổng hợp prôtêin.	  
D): kéo dài thời gian sống của mARN
Câu 33. Một đoạn polipeptit gồm có trình tự aa như sau: … Alamin – Lizin – Xistêin – Lizin  …Biết rằng các aa được mã hoá bởỉ bộ ba trên mARN như sau: Xistêin : UGX, lizin: AAA, Alamin: GXA. Đoạn ARN thông tin tương ứng có trình tự nu là
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
C): một đoạn phân tử axit nuclêic có chức năng điều hoà hoạt động của gen cấu trúc
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
Câu 52. Cho các thông tin về đột biến sau đây: (1) Xảy ra ở cấp độ phân tử, thường có tính thuận nghịch; (2) Làm thay đổi số lượng gen trên nhiễm sắc thể; (3) Làm mất một hoặc nhiều phân tử AND; (4) Làm xuất hiện những alen mới trong quần thể. Các thông tin nói về đột biến gen là:
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
Câu 60. Một đoạn mạch gốc của gen sao mã ra mARN có trình tự các nu như sau:  ....... TGG GXA XGT AGX TTT .........(...........2........3.......4........5.......6............) . Đột biến xảy ra làm G của bộ ba thứ 5 ở mạch gốc của gen bị thay bởi T sẽ làm cho 
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
CHỦ ĐỀ 2: CƠ CHẾ DT VÀ BD Ở CẤP ĐỘ TẾ BÀO
Câu 1. Đơn vị cơ bản cấu tạo nên NST là 
A): nuclêôxôm.	
B): nuclêôtit.		
C): ribôxôm	
D): crômatit.
Câu 2. Một nuclêôxôm gồm 
A): một đoạn phân tử ADN quấn ¼ vòng quanh khối cầu gồm 8 phân tử histôn.
B): phân tử ADN quấn 7/4 vòng quanh khối cầu gồm 8 phân tử histôn.
C): phân tử histôn được quấn quanh bởi 1 đoạn ADN dài 146 cặp nuclêôtit.
D): 8 phân tử histôn được quấn quanh bởi 7/4 vòng xoắn ADN dài 146 cặp nuclêotit.
Câu 3. Thành phần hoá học chính của NST ở sinh vật nhân thực là
A): ADN mạch kép và prôtêin dạng histôn.	
B): ADN mạch đơn và prôtêin dạng hisôn.
C): ADN và các enzim nhân đôi.			
D): ADN và prôtêin dạng histôn và phi histôn.
Câu 4. Mức xoắn 1 của NST là 
A): sợi cơ bản, đường kính 11nm			
B): sợi chất nhiễm sắc, đường kính 30nm.
C): siêu xoắn, đường kính 300nm.		
D): crômatic, đường kính 700nm.
Câu 5. Sự thu gọn cấu trúc không gian của nhiễm sắc thể: 
A): thuận lợi cho sự phân ly các nhiễm sắc thể trong quá trình phân bào.
B): thuận lợi cho sự tổ hợp các nhiễm sắc thể trong quá trình phân bào.
C): thuận lợi cho sự phân ly, sự tổ hợp các nhiễm sắc thể trong quá trình phân bào.
D): giúp tế bào chứa được nhiều nhiễm sắc thể.
Câu 6. Cấu trúc của NST ở sinh vật nhân thực có các mức xoắn theo trật tự
A): phân tử ADN  đơn vị cơ bản ( nuclêôxôm)    sợi cơ bản   sợi nhiễm sắc    crômatit
B): phân tử ADN   sợi cơ bản    đơn vị cơ bản ( nuclêôxôm)    sợi nhiễm sắc    crômatit
C): phân tử ADN    đơn vị cơ bản ( nuclêôxôm)   sợi nhiễm sắc   sợi cơ bản    crômatit
D): phân tử ADN   sợi cơ bản   sợi nhiễm sắc   đơn vị cơ bản ( nuclêôxôm)   crômatit
Câu 7. Đột biến nhiễm sắc thể (NST) gồm các dạng
A): đa bội và lệch bội					
B): thêm đoạn và đảo đoạn
C): chuyển đoạn tương hỗ và không tương hỗ		
D): đột biến số lượng và cấu trúc NST
Câu 8. Các dạng đột biến cấu trúc nhiễm sắc thể gồm
A): mất, lặp, đảo, chuyển đoạn.		
B): mất, thêm, đảo, chuyển đoạn.	
C): mất, thay, thêm, đảo đoạn.		
D): mất, thay, chuyển, đảo đoạn.
Câu 9. Sự tiếp hợp và trao đổi chéo không cân đối bất thường giữa các crômatit trong cặp tương đồng ở kì đầu 1 phân bào giảm nhiễm dẫn đến xuất hiện đột biến
A): lệch bội	
B): đa bội       	
C): lặp đoạn  và mất đoạn NST	
D): đảo đoạn NST
Câu 10. Một đoạn NST bình thường có trình tự các gen như sau: ABCDE*FGH ( dấu * biểu hiện cho tâm động), một đột biến xảy ra làm  NST có trình tự các gen: ABCF*EDGH, dạng đột biến đã xảy ra là
A): đảo đoạn ngoài tâm động	
B): đảo đoạn có chứa tâm động
C): chuyển đoạn tương hỗ	
D): chuyển đoạn không tương hỗ.
Câu 11. Hội chứng nào ở người  do đột biến cấu trúc nhiễm sắc thể?
A): Hội chứng Đao			
B): Hội chứng mèo kêu, Ung thư máu.	
C): Hội chứng Tớcnơ.			
D): Hội chứng Claiphentơ
Câu 12. Hiện tượng lặp đoạn nhiễm sắc thể sẽ dẫn đến
A): gây chết ở thực vật	
B): không ảnh hưởng đến kiểu hình do không mất chất liệu di truyền 
C): có thể làm tăng hay giảm độ biểu hiện của tính trạng 		
D): gây chết ở động vật.
Câu 13. Đột biến nào được ứng dụng để chuyển gen từ nhiễm sắc thể này sang nhiễm sắc thể khác?
A): Đột biến mất đoạn nhiễm sắc thể.		
B): Đột biến lặp đoạn nhiễm sắc thể.
C): Đột biến đảo đoạn nhiễm sắc thể.		
D): Đột biến chuyển đoạn nhiễm sắc thể.
Câu 14. Những đột biến nào gây ảnh hưởng nghiêm trọng nhất?
A): Mất đoạn và lặp đoạn.		
B): Mất đoạn và chuyển đoạn lớn
C): Đảo đoạn và chuyển đoạn.	           	
D): Lặp đoạn và chuyển đoạn.
Câu 15. Trong chọn giống, người ta đã ứng dụng dạng đột biến nào để loại bỏ những gen không mong muốn?
A): Mất đoạn NST.				
B): Đột biến gen.     
C): Chuyển đoạn không tương hỗ.		
D): Đảo đoạn không mang tâm động.
Câu 16. Những đột biến cấu trúc NST có thể làm  giảm số lượng gen trên NST
A): Mất đoạn và chuyển đoạn không tương hỗ.		
B): Mất đoạn và lặp đoạn.
C): Lặp đoạn và đảo đoạn.				
D): Đảo đoạn và chuyển đoạn tương hỗ.
Câu 17. Giả sử ở một loài thực vật có bộ nhiễm sắc thể 2n = 6, các cặp nhiễm sắc thể tương đồng được kí hiệu là Aa, Bb và Dd. Trong các dạng đột biến lệch bội sau đây, dạng nào là thể một?
A): AaaBb	
B): AaBb	
C): AaBbDdd   	
D): AaBbd
Câu 18. Hợp tử được tạo ra do sự kết hợp của 2 giao tử (n-1) có thể phát triển thành
A): thể 1 nhiễm.				
B): thể không.   
C): thể 1 nhiễm hoặc thể không.		
D): thể 1 nhiễm kép hoặc thể không.
Câu 19. Cho một số bệnh và hội chứng di truyền ở người:(1) Bệnh phêninkêto niệu; (2) Hội chứng Đao; (3) Hội chứng Tơcnơ; (4) Bệnh máu khó đông. Những bệnh hoặc hội chứng do đột biến nhiễm sắc thể là:
A): (2) và (3) 	
B): (1) và (2)	
C): (3) và (4)	
D): (1) và (4)
Câu 20. Hội chứng Đao xảy ra do
A): rối loạn phân li của cặp NST thứ 21.
B): sự kết hợp của giao tử bình thường với giao tử có 2 NST thứ 21.
C): người mẹ sinh con khi tuổi quá cao.
D): rối  loạn  phân  li  của  cặp  NST  thứ  21,  sự  kết  hợp  của  giao  tử  bình
Câu 21.Thể song nhị bội (thể dị đa bội)
A): chỉ sinh sản vô tính mà không có khả năng sinh sản hữu tính
B): chỉ biểu hiện các đặc điểm của một trong hai loài bố mẹ.
C): có 2n nhiễm sắc thể trong tế bào
D): có tế bào mang hai bộ nhiễm sắc thể lưỡng bội của hai loài bố mẹ
Câu 22. Nếu kí hiệu bộ nhiễm sắc thể của loài thứ nhất là AA, loài thứ 2 là BB thì thể song nhị bội là
A): AABB	
B): AAAA		
C): BBBB			
D): AB
Câu 23. Nếu kí hiệu bộ nhiễm sắc thể lưỡng bội của loài thứ nhất là AA, loài thứ 2 là BB, tự đa bội gồm
A): AABB và AAAA	
B): AAAA và  BBBB	
C): BBBB và AABB		
D): AB và AABB
Câu 24. Tế bào mang kiểu gen Aaa thuộc thể đột biến nào sau đây ? 
A): lệch bội 2n + 1 hay tam bội 3n. 		            
B): lệch bội 2n + 2 hay tứ bội 4n. 
C): lệch bội 2n – 2. 					
D): thể một nhiễm. 
Câu 25. Gen A quy định hạt đen, gen a quy định hạt trắng, biết quá trình giảm phân và thụ tinh bình thường, phép lai giữa mẹ có kiểu gen Aaa (thể ba) với bố có kiểu gen Aa tạo F1 phân li kiểu hình theo tỉ lệ
A): 3 hạt đen  :  1 hạt trắng.	 		
B): 1 hạt đen  :  1 hạt trắng.         
C): 2 hạt đen  :  1 hạt trắng.	 		
D): 4 hạt đen  :  1 hạt trắng.
Câu 26. Phép lai có thể tạo ra con lai mang kiểu gen AAAa là 
A): Aaaa  x  Aaaa   	 
B): Aaaa  x  aaaa            
C): Aaaa  x  AAaa
D): AAAA x  aaaa
Câu 27. Cho A quy định thân cao, a quy định thân thấp. Phép lai cho tỷ lệ kiểu hình 11 thân cao : 1 thân thấp là
A): Aaaa  x  Aaaa         
B): AAaa   x  AAaa	
C): AAaa  x  aaaa 	
D): AAaa  x  Aa
Câu 28. Cho biết gen A: thân cao, gen a: thân thấp. Các cơ thể mang lai đều giảm phân bình thường. Tỉ lệ kiểu hình tạo ra từ  Aaaa x Aaaa là
A): 11 thân cao : 1 thân thấp. 		
B): 15 thân cao : 1 thân thấp. 
C): 9 thân cao : 7 thân thấp. 		
D): 3 thân cao : 1 thân thấp.
CHỦ ĐỀ 3: TÍNH QUY LUẬT CỦA HIỆN TƯỢNG DI TRUYỀN
Câu 1. Cá thể có kiểu gen nào sau đây đồng hợp về 2 cặp gen? 
A): aaBB 		
B): AABb		
C): aaBb			
D): AaBB
Câu 2. Cá thể có kiểu gen nào sau đây dị hợp về 2 cặp gen? 
A): aaBB		
B): AaBB		
C): aaBb			
D): AaBb
Câu 3. Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: Aa × Aa thu được đời con có tỉ lệ kiểu gen Aa là
A): 1/2.            
B): 100%.	
C): 1/4.                        
D): 3/4.
Câu 4. Ở cà chua, alen A quy định quả đỏ trội hoàn toàn so với alen a quy định quả vàng. Cho biết quá trình giảm phân không xảy ra đột biến. Theo lí thuyết, phép lai nào sau đây cho đời con có tỉ lệ kiểu hình 1 cây quả đỏ : 1 cây quả vàng?
A): Aa × aa           
B): AA × aa	
C): Aa × Aa                       
D): AA × Aa
Câu 5. Ở cà chua, alen A quy định quả đỏ trội hoàn toàn so với alen a quy định quả vàng. Cho biết quá trình giảm phân không xảy ra đột biến. Theo lí thuyết, những phép lai nào sau đây cho đời con có tỉ lệ kiểu hình 3 cây quả đỏ : 1 cây quả vàng?
A): Aa × aa            
B): AA × aa
C): Aa × Aa                     
D): AA × Aa
Câu 6. Ở cà chua, alen A quy định quả đỏ trội hoàn toàn so với alen a quy định quả vàng. Cho biết quá trình giảm phân không xảy ra đột biến. Theo lí thuyết, những phép lai nào sau đây cho đời con có tỉ lệ kiểu hình 100% cây quả vàng?
A): Aa × aa           
B): aa× aa	
C): Aa × Aa                        
D): AA × Aa
Câu 7. Ở cà chua, alen A quy định quả đỏ trội hoàn toàn so với alen a quy định quả vàng. Cho biết quá trình giảm phân không xảy ra đột biến. Theo lí thuyết, những phép lai nào sau đây cho đời con có cả cây quả đỏ và cây quả vàng?
A): Aa × aa và AA × Aa	
B): AA × aa và AA × Aa
C): Aa × Aa và Aa × aa	
D): Aa × Aa và AA × Aa
Câu 8. Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: Aa × aa thu được đời con có tỉ lệ kiểu gen đồng hợp là
A): 1/2.            
B): 100%.	
C): 1/4.                        
D): 3/4.
Câu 9. Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: Aa × aa thu được đời con có tỉ lệ kiểu gen dị hợp là
A): 1/2.            
B): 100%.	
C): 1/4.                        
D): 3/4.
Câu 10. Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: AaBb × AaBb thu được đời con có tỉ lệ kiểu gen đồng hợp về 2 cặp gen là
A): 1/2.            
B): 100%.	
C): 1/4.                        
D): 3/4.
Câu 11. Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: AaBb × AaBb thu được đời con có tỉ lệ kiểu gen dị hợp về 2 cặp gen là
A): 1/2.            
B): 100%.	
C): 1/4.                        
D): 3/4.
Câu 12. Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: AaBb × AaBb thu được đời con có tỉ lệ kiểu gen đồng hợp về 1 cặp gen là
A): 1/2.            
B): 100%.	
C): 1/4.                        
D): 3/4.
Câu 13. Ở một loài thực vật, xét 2 cặp gen Aa và Bb phân li độc lập. Cho biết quá trình giảm phân không xảy ra đột biến. Cho cây có kiểu gen dị hợp về 2 cặp gen tự thụ phấn thu được đời con có tỉ lệ kiểu gen đồng hợp về 2 cặp gen trội là
A): 1/2.            
B): 1/4.	
C): 1/16.                        
D): 1/8.
Câu 14. Cho biết quá trình giảm phân không xảy ra đột biến. Theo lí thuyết, phép lai AaBb × AaBb cho đời con có kiểu gen aabb chiếm tỉ lệ
A): 25%.	
B): 6,25%.	
C): 50%.	
D): 12,5%.
Câu 15. Ở cà chua, alen A quy định quả đỏ trội hoàn toàn so với alen a quy định quả vàng. Cho biết quá trình giảm phân không xảy ra đột biến.  Thực hiện phép lai: Aa  x  Aa  thu được đời con có tỉ lệ kiểu hình cây quả vàng là
A): 1/2.            
B): 100%.	
C): 1/4.                        
D): 3/4.
Câu 16. Ở cà chua, alen A quy định quả đỏ trội hoàn toàn so với alen a quy định quả vàng. Cho biết quá trình giảm phân không xảy ra đột biến.  Thực hiện phép lai: AA  x  aa  thu được đời con có tỉ lệ kiểu hình cây quả đỏ là
A): 1/2.            
B): 100%.	
C): 1/4.                        
D): 3/4.
Câu 17. Ở cà chua, alen A quy định quả đỏ trội hoàn toàn so với alen a quy định quả vàng. Cho biết quá trình giảm phân không xảy ra đột biến.  Cho cây có kiểu gen dị hợp lai phân tích thu được đời con có tỉ lệ kiểu hình cây quả vàng là
A): 1/2.            
B): 100%.	
C): 1/4.                        
D): 3/4.
Câu 18. Cho một cây lưỡng bội dị hợp 2 cặp gen tự thụ phấn. Biết các gen phân ly độc lập và không có đột biến. Tính theo lý thuyết, tỉ lệ cá thể đồng hợp về 2 cặp gen và tỉ lệ cá thể đồng hợp về 1 cặp gen trong tổng số cá thể thu được lần lượt là
A): 50% và 50% .	
B): 25% và 50%.	
C): 50% và 25% .	
D): 25% và 25%.
Câu 19. Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: AA × aa thu được đời con có mấy loại kiểu gen?
A): 1.            
B): 2.	
C): 3.                        
D): 4.
Câu 20. Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: Aa × aa thu được đời con có mấy loại kiểu gen?
A): 1.            
B): 2.	
C): 3.                        
D): 4.
Câu 21. Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: Aa × Aa thu được đời con có mấy loại kiểu gen?
A): 1.            
B): 2.	
C): 3.                        
D): 4.
Câu 22. Ở một loài thực vật, gen A qui định quả đỏ trội hoàn toàn so với a qui định quả vàng. Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: AA × Aa thu được đời con có mấy loại kiểu hình?
A): 1.            
B): 2.	
C): 3.                        
D): 4.
Câu 23. Ở một loài thực vật, gen A qui định quả đỏ trội hoàn toàn so với a qui định quả vàng. Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: Aa × aa thu được đời con có mấy loại kiểu hình?
A): 1.            
B): 2.	
C): 3.                        
D): 4.
Câu 24. Ở một loài thực vật, gen A qui định quả đỏ trội hoàn toàn so với a qui định quả vàng. Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: Aa × Aa thu được đời con có mấy loại kiểu hình?	
A): 1.            
B): 2.				
C): 3.                        
D): 4.
Câu 25. Ở một loài thực vật, gen A qui định cây cao trội hoàn toàn so với a qui định cây thấp, gen B qui định quả đỏ trội hoàn toàn so với b qui định quả vàng Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: AaBb × AaBb thu được đời con có tỉ lệ kiểu hình thân cao, quả đỏ là
A): 9/16.            
B): 100%.	
C): 1/4.                        
D): 3/4.
Câu 26. Ở một loài thực vật, gen A qui định cây cao trội hoàn toàn so với a qui định cây thấp, gen B qui định quả đỏ trội hoàn toàn so với b qui định quả vàng Cho biết quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai  sau: AaBb × aabb thu được đời con có tỉ lệ kiểu hình thân thấp, quả đỏ là
A): 9/16.            
B): 100%.	
C): 1/4.                        
D): 3/4.
Câu 27. Cho biết mỗi gen quy định một tính trạng, các alen trội là trội hoàn toàn và quá trình giảm phân không xảy ra đột biến. Thực hiện phép lai:     x      thu được đời con có tỉ lệ kiểu hình là
A): 1: 1	
B): 3: 1                    
C): 1: 1: 1: 1	
D): 3: 1 : 3: 1                                       
Câu 28. Cho biết mỗi gen quy định một tính trạng, các alen trội là trội hoàn toàn và quá trình giảm phân không xảy ra đột biến. Theo lí thuyết, phép lai nào sau đây cho đời con có kiểu hình phân li theo tỉ lệ 1 : 1?
A):    x    	
B):    x     	
C):   x     	
D):   x     
Câu 29. Ở một loài thực vật, alen A quy định thân cao trội hoàn toàn so với alen a quy định thân thấp; alen B quy định hoa đỏ trội hoàn toàn so với alen b quy định hoa vàng. Biết không có đột biến xảy ra, tính theo lí thuyết, phép lai AaBb × Aabb cho đời con có kiểu hình thân cao, hoa đỏ chiếm tỉ lệ
A): 37,50%.	
B): 56,25%.	
C): 6,25%.	
D): 18,75%.
Câu 30. Ở một loài thực vật, alen A quy định thân cao trội hoàn toàn so với alen a quy định thân thấp; alen B quy định hoa đỏ trội hoàn toàn so với alen b quy định hoa vàng. Biết không có đột biến xảy ra, tính theo lí thuyết, phép lai AaBb × Aabb cho đời con có kiểu hình thân cao, hoa vàng chiếm tỉ lệ
A): 37,50%.	
B): 56,25%.	
C): 6,25%.	
D): 18,75%.
Câu 31. Ở một loài thực vật, alen A quy định thân cao trội hoàn toàn so với alen a quy định thân thấp; alen B quy định hoa đỏ trội hoàn toàn so với alen b quy định hoa vàng. Biết không có đột biến xảy ra, tính theo lí thuyết, phép lai AaBb × AaBb cho đời con có kiểu hình thân cao, hoa đỏ chiếm tỉ lệ
A): 37,50%.	
B): 56,25%.	
C): 6,25%.	
D): 18,75%.
Câu 32. Ở một loài thực vật, alen A quy định thân cao trội hoàn toàn so với alen a quy định thân thấp; alen B quy định hoa đỏ trội hoàn toàn so với alen b quy định hoa vàng. Biết không có đột biến xảy ra, tính theo lí thuyết, phép lai AaBb × AaBb cho đời con có kiểu hình thân cao, hoa vàng chiếm tỉ lệ
A): 37,50%.	
B): 56,25%.	
C): 6,25%.	
D): 18,75%.
Câu 33. Ở một loài thực vật, alen A quy định thân cao trội hoàn toàn so với alen a quy định thân thấp; alen B quy định hoa đỏ trội hoàn toàn so với alen b quy định hoa vàng. Biết không có đột biến xảy ra, tính theo lí thuyết, phép lai AaBb × AaBb cho đời con có kiểu hình thân thấp, hoa vàng chiếm tỉ lệ
A): 37,50%.	
B): 56,25%.	
C): 6,25%.	
D): 18,75%.
Câu 34. Cho biết quá trình giảm phân không xảy ra đột biến, các gen phân li độc lập và tác động riêng rẽ, các alen trội là trội hoàn toàn. Theo lí thuyết, phép lai AaBb× Aabb cho đời con có tối đa:
A): 6 loại kiểu gen và 4 loại kiểu hình.	
B): 4 loại kiểu gen và 2 loại kiểu hình.
C): 9 loại kiểu gen và 4 loại kiểu hình.	
D): 9 loại kiểu gen và 8 loại kiểu hình.
Câu 35. Cho biết quá trình giảm phân không xảy ra đột biến, các gen phân li độc lập và tác động riêng rẽ, các alen trội là trội hoàn toàn. Theo lí thuyết, phép lai AaBb× AaBb cho đời con có tối đa:
A): 8 loại kiểu gen và 6 loại kiểu hình.	
B): 4 loại kiểu gen và 2 loại kiểu hình.
C): 9 loại kiểu gen và 4 loại kiểu hình.	
D): 9 loại kiểu gen và 8 loại kiểu hình.
Câu 36. Ở ruồi giấm, gen A quy định mắt đỏ trội hoàn toàn so với alen a quy định mắt trắng, các gen này nằm trên nhiễm sắc thể giới tính X, không có alen tương ứng trên nhiễm sắc thể Y. Cho biết quá trình giảm phân diễn ra bình thường, thực hiện phép lai: XA Xa × XAY thu được đời con có kiểu hình mắt trắng chiếm tỉ lệ bao nhiêu?
A): 25%.	
B): 75%.	
C): 50%.	
D): 6,25%.
Câu 37. Ở ruồi giấm, gen W quy định mắt đỏ trội hoàn toàn so với alen w quy định mắt trắng, các gen này nằm trên nhiễm sắc thể giới tính X, không có alen tương ứng trên nhiễm sắc thể Y. Cho biết quá trình giảm phân diễn ra bình thường, phép lai nào sau đây cho đời con có kiểu hình phân li theo tỉ lệ 3 ruồi mắt đỏ : 1 ruồi mắt trắng và tất cả ruồi mắt trắng đều là ruồi đực?
A): XW XW  × Xw Y.	
B): XW Xw  × Xw Y.	
C): XW XW  × XW Y.	
D): XW Xw  × XW Y
Câu 38. Ở ruồi giấm, alen A quy định mắt đỏ là trội hoàn toàn so với alen a quy định mắt trắng. Tính theo lí thuyết, phép lai nào sau đây cho đời con có tỉ lệ kiểu hình là 3 ruồi mắt đỏ : 1 ruồi mắt trắng?
A): XA XA × XaY.	
B): XA Xa× XA Y.	
C): XaXa× XA Y.	
D): XA Xa× XaY.
Câu 39. Ở ruồi giấm, gen A quy định mắt đỏ trội hoàn toàn so với alen a quy định mắt trắng, các gen này nằm trên nhiễm sắc thể giới tính X, không có alen tương ứng trên nhiễm sắc thể Y. Cho biết quá trình giảm phân diễn ra bình thường, thực hiện phép lai: XA Xa × XaY thu được đời con có kiểu hình mắt trắng chiếm tỉ lệ bao nhiêu?
A): 25%.	
B): 75%.	
C): 50%.	
D): 6,25%.
Câu 40. Năm 1909, Coren (Correns) đã tiến hành phép lai thuận nghịch trên cây hoa phấn (Mirabilis jalapa) và thu được kết quả như sau: Phép lai thuận: P: ♀ Cây lá đốm × ♂ Cây lá xanh được F1 100% số cây lá đốm; Phép lai nghịch:  P: ♀ Cây lá xanh × ♂ Cây lá đốm  được F1 100% số cây lá xanh. Nếu lấy hạt phấn của cây F1 ở phép lai thuận thụ phấn cho cây F1 ở phép lai nghịch thì theo lí thuyết, thu được F2 gồm:
A): 100% số cây lá xanh.	
B): 75% số cây lá đốm : 25% số cây lá xanh.
C): 50% số cây lá đốm : 50% số cây lá xanh.	
D): 100% số cây lá đốm.
Câu 41. Phép lai nào trong các phép lai sau đây đã giúp Coren phát hiện ra sự di truyền ngoài nhiễm sắc thể (di truyền ngoài nhân)?
A): Lai phân tích.	
B): Lai thuận nghịch.	
C): Lai tế bào.	
D): Lai cận huyết.
Câu 42. Để xác một định tính trạng nào đó là do gen trong nhân hay gen ngoài nhân quy định, người ta
A): dùng phép lai phân tích.	
B): dùng phép lai thuận nghịch.
C): theo dõi phả hệ.	
D): theo dõi đời con F¬1.
Câu 43. Ở cà chua, gen A quy định quả đỏ, gen a quy định quả vàng, gen quy định tính trạng màu sắc quả nằm trên nhiễm sắc thể thường. Thực hiện Phép lai: AAAa x AAAa thu được đời con có kiểu hình quả đỏ chiếm tỉ lệ?
A): 25%.	
B): 75%.	
C): 50%.	
D): 100%.
Câu 44. Ở cà chua, gen A quy định quả đỏ, gen a quy định quả vàng, gen quy định tính trạng màu sắc quả nằm trên nhiễm sắc thể thường. Thực hiện Phép lai: AAaa x AAaa thu được đời con có kiểu hình quả đỏ chiếm tỉ lệ?
A): 1/6.	
B): 1/2.	
C): 35/36.	
D): 11/12.
Câu 45. Ở cà chua, gen A quy định quả đỏ, gen a quy định quả vàng, gen quy định tính trạng màu sắc quả nằm trên nhiễm sắc thể thường. Thực hiện Phép lai: AAaa x Aaaa thu được đời con có kiểu hình quả đỏ chiếm tỉ lệ?
A): 1/6.	
B): 1/2.	
C): 35/36.	
D): 11/12.
Câu 46. Ở cà chua, gen A quy định quả đỏ, gen a quy định quả vàng, gen quy định tính trạng màu sắc quả nằm trên nhiễm sắc thể thường. Thực hiện Phép lai: AAaa x aaaa thu được đời con có kiểu hình quả vàng chiếm tỉ lệ?
A): 1/6.	
B): 5/6.	
C): 35/36.	
D): 11/12.
Câu 47. Ở cà chua, gen A quy định quả đỏ, gen a quy định quả vàng, gen quy định tính trạng màu sắc quả nằm trên nhiễm sắc thể thường. Phép lai nào sau đây cho kết quả phân li kiểu hình có ở thế hệ con là 35 đỏ : 1 vàng?
A): AAaa  x AAAa	
B): AAaa x AAaa	
C): AAAa x AAAa	
D): Aaaa x AAaa
Câu 48. Ở cà chua, gen A quy định quả đỏ, gen a quy định quả vàng, gen quy định tính trạng màu sắc quả nằm trên nhiễm sắc thể thường. Phép lai nào sau đây cho kết quả phân li kiểu hình có ở thế hệ con là 3 đỏ : 1 vàng?
A): AAaa  x AAaa	
B): AAaa x Aaaa	
C): AAAA x AAAa	
D): Aaaa x Aaaa
Câu 49. Ở cà chua, gen A quy định quả đỏ, gen a quy định quả vàng, gen quy định tính trạng màu sắc quả nằm trên nhiễm sắc thể thường. Phép lai nào sau đây cho kết quả phân li kiểu hình có ở thế hệ con là 11 đỏ : 1 vàng?
A): AAaa  x Aaaa	
B): AAaa x AAaa	
C): AAAa x AAAA	
D): Aaaa x AAAA
Câu 50. Trường hợp không có đột biến, cơ thể mang kiểu gen AA có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 51. Trường hợp không có đột biến, cơ thể mang kiểu gen Aa có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 52.Trường hợp không có đột biến, cơ thể mang kiểu gen AABb có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 53. Trường hợp không có đột biến, cơ thể mang kiểu gen AaBb có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 54. Trường hợp không có đột biến, một tế bào sinh tinh có kiểu gen AaBb có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 55. Trường hợp không có đột biến, hai tế bào sinh tinh có kiểu gen AaBb có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		 
D): 4.
Câu 56. Trường hợp không có đột biến, ba tế bào sinh tinh có kiểu gen AaBb có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 57. Trường hợp không có đột biến, một tế bào sinh trứng có kiểu gen AaBb có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 58. Trường hợp không có đột biến, cơ thể mang kiểu gen AaBbDd có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 8.	      		  
D): 4.
Câu 59. Trường hợp không có đột biến, một tế bào sinh tinh có kiểu gen AaBbDd có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 60. Trường hợp không có đột biến, cơ thể mang kiểu gen AaBbdd có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 61. Trường hợp không có đột biến, một tế bào sinh trứng có kiểu gen AaBbDd có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 62. Trường hợp không có đột biến, hai tế bào sinh trứng có kiểu gen AaBbDd có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 63. Trường hợp không có hoán vị gen và đột biến, cơ thể mang kiểu gen   có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		 
D): 4.
Câu 64. Trường hợp không có hoán vị gen và đột biến, cơ thể mang kiểu gen   có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 65. Trường hợp không có hoán vị gen và đột biến, cơ thể mang kiểu gen   có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 66. Trường hợp không có hoán vị gen và đột biến, cơ thể mang kiểu gen   có thể tạo ra tối đa mấy loại giao tử?
A): 1.           		
B): 2.			
C): 3.	      		  
D): 4.
Câu 67. Cho biết quá trình giảm phân không xảy ra đột biến nhưng xảy ra hoán vị gen với tần số 20%. Theo lí thuyết, tỉ lệ các loại giao tử được tạo ra từ quá trình giảm phân của cơ thể có kiểu gen   là:
A): AB =  ab  = 30% và Ab  =  aB  = 20%.	
B): AB =  ab  = 20% và Ab  =  aB  = 30%.
C): AB =  ab  = 40% và Ab  =  aB  = 10%.	
D): AB =  ab  = 10% và Ab  =  aB  = 40%
Câu 68. Cho biết quá trình giảm phân không xảy ra đột biến nhưng xảy ra hoán vị gen với tần số 20%. Theo lí thuyết, tỉ lệ các loại giao tử được tạo ra từ quá trình giảm phân của cơ thể có kiểu gen   là:
A): AB =  ab  = 30% và Ab  =  aB  = 20%.	
B): AB =  ab  = 20% và Ab  =  aB  = 30%.
C): AB =  ab  = 40% và Ab  =  aB  = 10%.	
D): AB =  ab  = 10% và Ab  =  aB  = 40%
Câu 69. Cho biết quá trình giảm phân không xảy ra đột biến nhưng xảy ra hoán vị gen với tần số 30%. Theo lí thuyết, tỉ lệ các loại giao tử được tạo ra từ quá trình giảm phân của cơ thể có kiểu gen   là:
A): AB =  ab  = 35% và Ab  =  aB  = 15%.	
B): AB =  ab  = 20% và Ab  =  aB  = 30%.
C): AB =  ab  = 15% và Ab  =  aB  = 35%.	
D): AB =  ab  = 10% và Ab  =  aB  = 40%
Câu 70. Cho biết quá trình giảm phân không xảy ra đột biến nhưng xảy ra hoán vị gen với tần số 30%. Theo lí thuyết, tỉ lệ các loại giao tử được tạo ra từ quá trình giảm phân của cơ thể có kiểu gen   là:
A): AB =  ab  = 35% và Ab  =  aB  = 15%.	
B): AB =  ab  = 20% và Ab  =  aB  = 30%.
C): AB =  ab  = 15% và Ab  =  aB  = 35%.	
D): AB =  ab  = 10% và Ab  =  aB  = 40%.
CHỦ ĐỀ 4: DI TRUYỀN HỌC QUẦN THỂ
Câu 1. Vốn gen của quần thể là 
A): tổng số các kiểu gen của quần thể.		
B): toàn bộ các alen của tất cả các gen trong quần thể.
C): tần số kiểu gen của quần thể.			
D): tần số các alen của quần thể.
Câu 2. Tần số tương đối của một alen được tính bằng
A): tỉ lệ % các kiểu gen của alen đó trong quần thể.    
B): tỉ lệ % số giao tử của alen đó trong quần thể.
C): tỉ lệ % số tế bào lưỡng bội mang alen đó trong quần thể.       
D): tỉ lệ % các kiểu hình của alen đó trong quần thể.
Câu 3. Tần số của một loại kiểu gen nào đó trong quần thể được tính bằng tỉ lệ giữa
A): số lượng alen đó trên tổng số alen của quần thể.       
B): số cá thể có kiểu gen đó trên tổng số alen của quần thể.
C): số cá thể có kiểu gen đó trên tổng số cá thể của quần thể.  
D): số lượng alen đó trên tổng số cá thể của quần thể.
Câu 4. Nếu xét một gen có 3 alen nằm trên nhiễm sắc thể thường thì số loại kiểu gen tối đa trong một quần thể ngẫu phối là
A): 4. 	
B): 6.	
C): 8.	
D): 10.
Câu 5. Một quần thể có cấu trúc di truyền 0,04 AA + 0,32 Aa + 0,64 aa = 1. Tần số tương đối A, a lần lượt là
A): 0,3 ; 0,7	
B): 0,8 ; 0,2	
C): 0,7 ; 0,3	
D): 0,2 ; 0,8
Câu 6. Khi thống kê số lượng cá thể của một quần thể sóc, người ta thu được số liệu 105AA ; 15Aa ; 30aa Tần số tương đối của mỗi alen trong quần thể là 
A): A = 0,70 ; a = 0,30 	
B): A = 0,80 ; a = 0,20         
C): A = 0,25 ; a = 0,75     
D): A =0,75 ; a=0,25 
Câu 7. Quần thể tự phối có đặc điểm di truyền gì?
A): tần số tương đối các alen và tần số các kiểu gen luôn thay đổi qua các thế hệ
B): tần số tương đối các alen duy trì không đổi nhưng tần số các kiểu gen luôn thay đổi qua các thế hệ
C): tần số tương đối các alen luôn thay đổi nhưng tần số các kiểu gen duy trì không đổi qua các thế hệ
D): tần số tương đối các alen và tần số các kiểu gen luôn duy trì không đổi qua các thế hệ
Câu 8. Cấu trúc di truyền của quần thể ban đầu  0,2 AA + 0,6 Aa + 0,2 aa = 1. Sau 2 thế hệ tự phối thì cấu trúc di truyền của quần thể sẽ là
A): 0,35 AA + 0,30 Aa + 0,35 aa = 1.	
B): 0,425 AA + 0,15 Aa + 0,425 aa = 1.	
C): 0,25 AA + 0,50Aa + 0,25 aa = 1.	
D): 0,4625 AA + 0,075 Aa + 0,4625 aa = 1.
Câu 9. Giả sử một quần thể khởi đầu chỉ có một kiểu gen dị hợp Aa Sau một số thế hệ tự phối, tỉ lệ của mỗi cá thể đồng hợp là  . Tỉ lệ đó đựơc tạo ra ở thế hệ tự phối thứ
A): 3.	
B): 4.	
C): 5.	
D): 6.
Câu 10. Điều nào dưới đây là không đúng khi nói về quần thể ngẫu phối?
A): các cá thể trong quần thể chỉ giống nhau ở những nét cơ bản và khác nhau về nhiều chi tiết
B): có sự đa dạng về kiểu gen tạo nên sự đa dạng về kiểu hình
C): quá trình giao phối là nguyên nhân dẫn đến sự đa hình của quần thể
D): tần số kiểu gen đồng hợp ngày càng tăng và kiểu gen dị hợp ngày càng giảm
Câu 11. Định luật Hacđi-Vanbec phản ánh sự	
A): mất ổn định tần số tương đối của các alen trong quần thể ngẫu phối.
B): mất ổn định tần số các thể đồng hợp trong quần thể ngẫu phối.
C): ổn định về tần số alen và thành phần kiểu gen trong quần thể ngẫu phối.
D): mất cân bằng thành phần kiểu gen trong quần thể ngẫu phối.
Câu 12. Xét một quần thể ngẫu phối gồm 2 alen A, a trên nhiễm sắc thể thường. Gọi p, q lần lượt là tần số của alen A, a ( ; p + q = 1). Theo Hacđi-Vanbec thành phần kiểu gen của quần thể đạt trạng thái cân bằng có dạng
A): p2AA + 2pqAa + q2aa = 1 	
B): p2Aa + 2pqAA + q2aa = 1 
C): q2AA + 2pqAa + q2aa = 1  	
D): p2aa + 2pqAa + q2AA = 1 
Câu 13. Một quần thể giao phối có thành phần kiểu gen là dAA + hAa + raa = 1 sẽ cân bằng di truyền khi
A): tần số alen A = a	
B): d = h = r	
C): d . r = h                    
D): d . r = (h/2)2.
Câu 14. Điều không đúng về ý nghĩa của định luật Hacđi- Van béc là
A): Các quần thể trong tự nhiên luôn đạt trạng thái cân bằng.
B): Giải thích vì sao trong tự nhiên có nhiều quần thể đã duy trì ổn định qua thời gian dài.
C): Từ tỉ lệ kiểu hình trong quần thể có thể suy ra tỉ lệ các loại kiểu gen và tần số tương đối của các alen.
D): Từ tần số tương đối của các alen có thể dự đoán tỉ lệ các loại kiểu gen và kiểu hình.
Câu 15. Quần thể nào sau đây có thành phần kiểu gen đạt trạng thái cân bằng? 
A): 2,25%AA ; 25,5%Aa ; 72,25%aa 	
B): 16%AA ; 20%Aa ; 64%aa 
C): 36%AA ; 28%Aa ; 36%aa 	
D): 25%AA ; 11%Aa ; 64%aa 
Câu 16. Trong một quần thể thực vật cây cao trội hoàn toàn so với cây thấp. Quần thể luôn đạt trạng thái cân bằng Hacđi- Van béc là quần thể có 
A):  toàn cây cao.	   				
B): 1/2 số cây cao, 1/2 số cây  thấp.	
C):  1/4 số cây cao, còn lại cây thấp.			
D): toàn cây thấp.
Câu 17. Một quần thể đang cân bằng di truyền có tần số tương đối  =   ,tỉ lệ phân bố kiểu gen trong quần thể là
A): 0, 42AA + 0,36 Aa + 0,16 aa			
B): 0,36 AA + 0,48 Aa + 0,16 aa
C): 0,16 AA + 0,42 Aa + 0,36aa			     	
D): 0,36 AA + 0,16 Aa + 0,42aa
Câu 18. Một quần thể ngẫu phối có cấu trúc di truyền ở thế  hệ P là 0,5AA + 0,40Aa + 0,10aa = 1. Tính theo lí thuyết, cấu trúc di truyền của quần thể này ở thế hệ F1 là
A): 0,60AA + 0,20Aa + 0,20aa = 1		
B): 0,50AA + 0,40Aa + 0,10aa = 1.
C): 0,49AA + 0,42Aa + 0,09aa = 1.		
D): 0,42AA + 0,49Aa + 0,09aa = 1
Câu 19. Một quần thể động vật tại thời điểm thống kê có cấu trúc di truyền 0,7 AA: 0,1 Aa: 0,2aa, nếu không có các yếu tố làm thay đổi cấu trúc di truyền của quần thể thì tần số các alen trong quần thể ở F2 là
A): 0,65A; ,035a		
B): 0,75A; 0,25a	
C): 0,25A; ,075a	
D): 0,55A; ,045a
Câu 20. Một quần thể ở trạng thái cân bằng Hacđi-Vanbec có 2 alen D, d ; trong đó số cá thể dd chiếm tỉ lệ 16%. Tần số tương đối của mỗi alen trong quần thể là bao nhiêu?
A): D = 0,16 ; d = 0,84 	
B): D = 0,4 ; d = 0,6    
C): D = 0,84 ; d = 0,16     
D): D = 0,6 ; d = 0,4 
Câu 21. Trong một quần thể người tần số bị chứng bạch tạng (aa) được xác định là 1/10000. Giả sử quần thể đang ở trạng thái cân bằng. Tần số kiểu gen dị hợp (Aa) trong quần thể là
A): 0,0010.		
B): 0,9990.		
C): 0,0198.	 	
D): 0,0001.
Câu 22. Một quần thể có thành phần kiểu gen là 0,16 AA : 0,48 Aa : 0,36 aa. Tần số alen a của quần thể này là 
A): 0,5.                         
B): 0,6.                            
C): 0,3.                             
D): 0,4.  
Câu 23. Một quần thế có thành phần kiểu gen 0,4 Aa : 0,6 aa. Tần số alen a của quần thể này là 
A): 0,6.                       	
B): 0,8.            		
C): 0,4.                    	
D): 0,3.
Câu 24. Một quần thể có thành phần kiểu gen là: 0,2AA : 0,2Aa : 0,6aa. Tần số alen A của quần thể này là
A): 0,7.	
B): 0,5.	
C): 0,3.	
D): 0,4.
Câu 25. Một quần thể có cấu trúc di truyền là 0,8 EE: 0,2 Ee. Theo lí thuyết, tần số alen e của quần thể này là 
A): 0,2.	
B): 0,9.	
C): 0,8.	
D): 0,1.
Câu 26. Ở một loài thực vật, gen trội A quy định quả đỏ, alen lặn a quy định quả vàng. Một quần thể của loài trên ở trạng thái cân bằng di truyền có 75% số cây quả đỏ và 25% số cây quả vàng. Tần số tương đối của các alen A và a trong quần thể là
A): 0,2A và 0,8a	
B): 0,4A và 0,6a	
C): 0,5A và 0,5a	
D): 0,6A và 0,4a
Câu 27. Một quần thể đang ở trạng thái cân bằng di truyền có tần số alen A là 0,4. Tần số kiểu gen AA là              
A): 0,48.                      
B): 0,40.                
C): 0,60.              
D): 0,16. 
Câu 28. Một quần thể đang ở trạng thái cân bằng di truyền có tần số alen a là 0,7. Theo lí thuyết, tần số kiểu gen aa của quần thể này là                  
A): 0,09.                        
B): 0,49.                   
C): 0,42.              
D): 0,60. 
Câu 29. Ở một loài động vật, các kiểu gen: AA quy định lông đen; Aa quy định lông đốm; aa quy định lông trắng. Xét một quần thể đang ở trạng thái cân bằng di truyền gồm 500 con, trong đó có 20 con lông trắng. Tỉ lệ những con lông đốm trong quần thể này là
A): 4%.	
B): 32%.	
C): 16%.	
D): 64%.
Câu 30. Giả sử trong một quần thể thực vật ở thế hệ xuất phát các cá thể đều có kiểu gen Aa. Tính theo lý thuyết, tỉ lệ kiểu gen AA trong quần thể sau 5 thế hệ tự thụ phấn bắt buộc là
A): 48,4375%.	
B): 37,5000%.	
C): 46,8750%.	
D): 43,7500%.
Câu 31. Quần thể nào sau đây ở trạng thái cân bằng di truyền?
A): 0,01Aa : 0,18aa : 0,81AA	
B): 0,81Aa : 0,18aa : 0,01AA
C): 0,81AA : 0,18Aa : 0,01aa	
D): 0,81 Aa : 0,01aa : 0,18AA
Câu 32. Một quần thể giao phối ở trạng thái cân bằng di truyền, xét một gen có hai alen (A và a), người ta thấy số cá thể đồng hợp trội nhiều gấp 9 lần số cá thể đồng hợp lặn. Tỉ lệ phần trăm số cá thể dị hợp trong quần thể này là 
A): 18,75%.	
B): 56,25%.	
C): 37,5%.	
D): 3,75%.
Câu 33. Một quần thể ngẫu phối có thành phần kiểu gen ở thể hệ P là 0,64 Aa : 0.27 AA : 0,09 aa. Cho biết alen A trội hoàn toàn so với alen a. Theo lí thuyết, phát biểu nào sau đây sai về quần thể này?
A): Nếu có tác động của nhân tố đột biến thì tần số alen A có thể thay đổi. 
B): Nếu có tác động của chọn lọc tự nhiên thì tần số kiểu hình trội có thể bị giảm mạnh. 
C): Nếu không có tác động của các nhân tố tiến hóa thì tần số các kiểu gen không thay đổi qua tất cả các thế hệ. 
D): Nếu có tác động của các yếu tô ngẫu nhiên thì alen a có thể bị loại bỏ hoàn toàn khỏi quần thể.
CHỦ ĐỀ 5: ỨNG DỤNG DI TRUYỀN HỌC
Câu 1. Nguồn nguyên liệu làm cơ sở vật chất để tạo giống mới là
A): các biến dị tổ hợp.	              
B): các biến dị đột biến.
C): các ADN tái tổ hợp.	              
D): các biến dị di truyền (biến dị tổ hợp, đột biến, ADN tái tổ hợp)
Câu 2. Các nội dung chủ yếu của phương pháp tạo giống dựa trên nguồn biến dị tổ hợp là: 1 . Tạo ra các dòng thuần chủng có kiểu gen khác nhau. 2.  Sử dụng các tác nhân đột biến để gây biến dị có di truyền lên các giống. 3 . Lai các dòng thuần chủng có kiểu gen khác nhau và chọn lọc những tổ hợp gen mong muốn. 4 . Cho tự thụ phấn hoặc giao phối gần các dòng có tổ hợp gen mong muốn để tạo ra giống thuần chủng. 5 .Chọn lọc các đột biến tốt phù hợp với yêu cầu. Phương án đúng theo thứ tự là :
A): 1,3,4,5	
B): 1,3,4	
C): 2,3,4	
D): 3,4,1
Câu 3. Trong chọn giống, để tạo ra dòng thuần người ta tiến hành phương pháp
A): tự thụ phấn hoặc giao phối cận huyết.	
B): lai khác dòng.
C): lai xa		
D): lai khác thứ.
Câu 4. Phương pháp chủ yếu để tạo ra biến dị tổ hợp trong chọn giống vật nuôi, cây trồng là
A): sử dụng các tác nhân vật lí   			
B): sử dụng các tác nhân hoá học	  
C): lai hữu tính       				
D): thay đổi môi trường sống
Câu 5. Hiện tượng con lai có năng suất, phẩm chất, sức chống chịu, khả năng sinh trưởng và phát triển vượt trội bố mẹ gọi là
A): thoái hóa giống.	
B): ưu thế lai.               
C): bất thụ.                   
D): siêu trội.
Câu 6. Khi nói về ưu thế lai, phát biểu nào sau đây không đúng? 	
A): Người ta tạo ra những con lai khác dòng có ưu thế lai cao để sử dụng cho việc nhân giống. 
B): Để tạo ra những con lai có ưu thế lai cao về một sốđặc tính nào đó, người ta thường bắt đầu bằng cách tạo ra những dòng thuần chủng khác nhau. 
C): Trong một số trường hợp, lai giữa hai dòng nhất định thu được con lai không có ưu thế lai, nhưng nếu cho con lai này lai với dòng thứ ba thì đời con lại có ưu thế lai. 
D): Một trong những giả thuyết để giải thích cơ sở di truyền của ưu thế lai được nhiều người thừa nhận là giả thuyết siêu trội. 
Câu 7. Ưu thế lai thường giảm dần qua các thế hệ sau vì làm
A): thể dị hợp không thay đổi.	
B): sức sống của sinh vật có giảm sút.
C): xuất hiện các thể đồng hợp.	
D): xuất hiện các thể đồng hợp lặn có hại.
Câu 8. Nội dung giả thuyết siêu trội giải thích hiện tượng ưu thế lai:
A): cơ thể dị hợp tốt hơn thể đồng hợp do hiệu quả bổ trợ giữa 2 alen khác nhau về chức phận trong cùng 1 lôcus
B): các alen trội thường có tác động có lợi nhiều hơn alen lặn, tác động cộng gộp giữa các gen trội có lợi dẫn đến ƯTL
C): trong thể dị hợp,alen trội át chế sự biểu hiện của alen lặn có hại không cho các alen này biểu hiện
D): cơ thể lai nhận được nhiều đặc tính tốt của cả bố và mẹ nên tốt hơn bố mẹ
Câu 9. Trong việc tạo ưu thế lai, lai thuận và lai nghịch giữa dòng thuần chủng có mục đích
A): phát hiện các đặc điểm được tạo ra từ hiện tượng hoán vị gen để tìm tổ hợp lai có giá trị kinh tế nhất.
B): xác định được vai trò của các gen di truyền liên kết với giới tính.
C): đánh giá vai trò của tế bào chất lên sự biểu hiện tính trạng, để tìm tổ hợp lai có giá trị kinh tế nhất.
D): phát hiện được các đặc điểm di truyền tốt của dòng mẹ.
Câu 10. Đối với cây trồng, để duy trì và củng cố ưu thế lai người ta có thể sử dụng 
A): sinh sản sinh dưỡng.		
B): lai luân phiên.	
C): tự thụ phấn.		
D): lai khác thứ.
Câu 11. Gây đột biến tạo giống mới là phương pháp:
A): Sử dụng tác nhân gây đột biến tác động lên sinh vật tạo ra giống mới.
B): Sử dụng tác nhân vật lí và hóa  học làm thay đổi kiểu hình của SV để phục vụ cho lợi ích của con người.
C): Sử dụng tác nhân vật lí và hóa  học làm thay đổi vật liệu di truyền  của SV để phục vụ cho lợi ích của con người.
D): Sử dụng tác nhân vật lí và hóa  học tạo biến dị tổ hợp phục vụ cho lợi ích của con người .
Câu 12. Trong chọn giống cây trồng, phương pháp gây đột biến nhân tạo nhằm mục đích 
A): Tạo nguồn biến dị cung cấp cho quá trình tiến hoá 
B): Tạo dòng thuần chủng về các tính trạng mong muốn 
C): Tạo ra những biến đổi về kiểu hình mà không có sự thay đổi về kiểu gen 
D): Tạo nguồn biến dị cung cấp cho quá trình chọn giống 
Câu 13. Dưới đây là các bước trong các quy trình tạo giống mới: I. Cho tự thụ phấn hoặc lai xa để tạo ra các giống thuần chủng. II. Chọn lọc các thể đột biến có kiểu hình mong muốn. III. Xử lý mẫu vật bằng tác nhân đột biến. IV. Tạo dòng thuần chủng. Quy trình nào sau đây đúng nhất trong việc tạo giống bằng phương pháp gây đột biến?
A): I  → III → II.        
B): III → II → I.      
C): III → II → IV.         
D): II → III → IV.
Câu 14. Tia tử ngoại thường được dùng để gây đột biến nhân tạo trên các đối tượng
A): hạt nảy mầm và vi sinh vật.			
B): hạt khô và bào tử.       
C): hạt phấn và hạt nảy mầm.    			
D): vi sinh vật, hạt phấn, bào tử.
Câu 15. Khi chiếu xạ với cường độ thích hợp lên túi phấn, bầu noãn, nụ hoa, người ta mong muốn tạo ra loại biến dị nào 
A): Đột biến tiền phôi	
B): Đột biến giao tử	
C): Đột biến xôma		
D): Đột biến đa bội
Câu 16. Trong quá trình phân bào, cơ chế tác dụng của cônsixin là: 
A): Làm cho 1 cặp NST không phân li.
B): Làm đứt tơ của thoi vô sắc do đó toàn bộ NST trong TB không phân li.
C): Gây sao chép nhầm hoặc biến đổi cấu trúc của gen gây đột biến đa bội.
D): Ngăn cản sự hình thành thoi vô sắc do đó toàn bộ NST nhân đôi nhưng không phân li.   
Câu 17. Phương pháp gây đột biến nhân tạo được sử dụng phổ biến đối với 
A): thực vật và vi sinh vật.	    	
B): động vật và vi sinh vật.	    
C): động vật bậc thấp. 		
D): động vật và thực vật.
Câu 18. Dạng đột biến nào sau đây có giá trị trong chọn giống cây trồng nhằm tạo ra những giống có năng suất cao, phẩm chất tốt, không có hạt?                         
A): đột biến gen		
B): đột biến lệch bội	
C): đột biến đa bội	
D): đột biến thể ba
Câu 19. Cho các thành tựu sau: (1) Tạo giống cà chua có gen làm chính quả bị bất hoại. (2) Tạo giống dâu tằm tứ bội. (3) Tạo giống lúa "gạo vàng" có khả năng tổng hợp  β-carôten trong hạt. (4) Tạo giống dưa hấu đa bội. Các thành tựu được tạo ra bằng phương pháp gây đột biến là:
A): (1) và (3)	
B): (1) và (2)	
C): (3) và (4)	
D): (2) và (4) 
Câu 20. Cơ quan hoặc cơ thể hoàn chỉnh do nuôi cấy mô tạo thành lại có kiểu gen như dạng gốc vì
A): Kiểu gen được duy trì ổn định thông qua nguyên phân và giảm phân 	
B): Kiểu gen được duy trì ổn định thông qua trực phân
C): Kiểu gen được duy trì ổn định thông qua  giảm phân			
D): Kiểu gen được duy trì ổn định thông qua nguyên phân 
Câu 21. Phương pháp cơ thể tạo ra cơ thể lai có nguồn gen khác xa nhau mà bằng phương pháp lai hữu tính không thể thực hiện được là lai
A): khác dòng.		
B): tế bào sinh dưỡng. 	
C): khác thứ.		
D): khác loài.
Câu 22. Trong kĩ thuật lai tế bào, tế bào trần là?
A): Các tế bào sinh dục tự do được lấy ra khỏi cơ quan sinh dục    
B): Các tế bào xôma tự do được tách ra khỏi tổ chức sinh dưỡng 
C): Các tế bào đã được xử lí hoá chất làm tan thành tế bào            
D): Các  tế bào khác loài đã hoà nhập để trở thành tế bào lai
Câu 23. Đặc điểm nổi bật của phương pháp dung hợp 2 tế bào trần so với lai xa:
A): tránh được hiện tượng bất thụ của cơ thể lai xa	
B): tạo được dòng thuần nhanh nhất
C): tạo được giống mới mang những đặc điểm mới không có ở bố mẹ    
D): tạo giống mới mang đặc điểm của 2 loài bố mẹ
Câu 24. Quy trình tạo giống mới bằng phương pháp nuôi cấy hạt phấn (noãn)
A): nuôi cấy hạt phấn (noãn) chưa thụ tinh trong ống nghiệm cây đơn bộigâylưỡng bội hóa tạo cây lưỡngbội
B): nuôi cấy hạt phấn (noãn) đã thụ tinh trong ống nghiệmcây đơn bộigây lưỡng bội hóa tạo cây lưỡngbội 
C): nuôi cấy hạt phấn (noãn) chưa thụ tinh trong ống nghiệm cây lưỡng bội
D): nuôi cấy hạt phấn (noãn) đã thụ tinh trong ống nghiệm tạo cây lưỡng bội
Câu 25. Khi nói về quy trình nuôi cấy hạt phấn, phát biểu nào sau đây là không  đúng? 
A): Các hạt phấn có thể mọc trên môi trường nuôi cấy nhân tạo để tạo thành các dòng tế bào đơn bội.
B): Dòng tế bào đơn bội được xử lí hoá chất (cônsixin) gây lưỡng bội hoá tạo nên dòng tế bào lưỡng bội.
C): Giống được tạo ra từ phương pháp này có kiểu gen dị hợp, thể hiện ưu thế lai cao nhất.
D): Sự lưỡng bội  hoá các dòng tế bào đơn bội sẽ tạo ra được các dòng lưỡng bội thuần chủng.
Câu 26. Điều không thuộc công nghệ tế bào thực vật là
A): đã tạo ra các cây trồng đồng nhất về kiểu gen nhanh từ một cây có kiểu gen quý hiếm.
B): lai các giống cây khác loài bằng kĩ thuật dung hợp tế bào trần.
C): nuôi cấy hạt phấn rồi gây lưỡng bội tạo ra các cây lưỡng bội hoàn chỉnh và đồng nhất về kiểu gen.
D): tạo ra cây trồng chuyển gen cho năng suất rất cao.
Câu 27. Trong công nghệ tế bào động vật đã thành công khi
A): nhân bản vô tính động vật, cấy truyền phôi.		
B): lai tế bào xôma, cấy truyền phôi.
C): lai tế bào xôma, tạo động vật chuyển gen.		
D): nhân bản vô tính động vật, lai tế bào xôm
Câu 28. Khâu nào sau đây không có trong kĩ thuật cấy truyền phôi
A): Tách phôi thành 2 hay nhiều phần, mỗi phần sau đó sẽ phát triển thành 1 phôi riêng biệt
B): Tách nhân ra khỏi hợp tử, sau đó chia nhân ra thành nhiều phần nhỏ rồi lại chuyển vào hợp tử
C): Phối hợp 2 hay nhiều phôi thành một thể khảm
D): Làm biến đổi các thành phần trong TB của phôi khi mới phát triển theo hướng có lợi cho con người
Câu 29. Bằng công nghệ tế bào thực vật, người ta có thể nuôi cấy các mẫu mô của một cơ thể thực vật rồi sau đó cho chúng tái sinh thành các cây. Bằng kĩ thuật chia cắt một phôi động vật thành nhiều phôi rồi cấy các phôi này vào tử cung của các con vật khác nhau cũng có thể tạo ra nhiều con vật quý hiếm. Đặc điểm chung của hai phương pháp này là
A): Đều thao tác trên vật liệu di truyền là ADN và NST   
B): Đều tạo ra các cá thể có kiểu gen thuần chủng
C): Đều tạo ra các cá thể có kiểu gen đồng nhất	
D): Các cá thể tạo ra rất đa dạng về kiểu gen và kiểu hình
Câu 30. Cho các phương pháp sau: (1) Tự thụ phấn bắt buộc qua nhiều thế hệ. (2) Dung hợp tế bào trần khác loài.(3) Lai giữa các dòng thuần chủng có kiểu gen khác nhau để tạo ra F1; (4)Nuôi cấy hạt phấn rồi tiến hành lưỡng bội hóa các dòng đơn bội.Các phương pháp có thể sử dụng để tạo ra dòng thuần chủng ở thực vật là:
A): (1), (2). 		
B): (1), (4). 		
C): (2), (3). 		
D): (1), (3).
Câu 31. Công nghệ gen là:
A): Quy trình tạo những tế bào có gen bị biến đổi
B): Quy trình tạo những tế bào hoặc sinh vật có gen bị biến đổi
C): Quy trình tạo những tế bào có gen bị biến đổi hoặc có thêm gen mới
D): Quy trình tạo những tế bào hoặc sinh vật có gen bị biến đổi hoặc có thêm gen mới
Câu 32. Phân tử ADN tái tổ hợp là:
A): phân tử ADN lạ được chuyển vào tế bào nhận	   
B): phân tử ADN được tìm thấy trong nhân của vi khuẩn
C): Một dạng ADN cấu tạo nên các plasmit của vi khuẩn	     
D): Đoạn ADN của tế bào cho kết hợp với ADN của plasmit
Câu 33. Trong kỹ thuật di truyền người ta thường dùng thể truyền là
A): thực khuẩn thể và vi khuẩn.   			
B): plasmits và nấm men.   
C): thực khuẩn thể và nấm men.   	 	
D): plasmits và thực khuẩn thể.
Câu 34. Đặc điểm nào không phải của plasmit
A): Nằm trong tế bào chất của vi khuẩn          		      
B): ADN dạng vòng mạch kép
C): Vectơ chuyển gen từ tế bào cho sang tế bào nhận       	      
D): ADN mạch thẳng , dễ tạo ADN tái tổ hợp
Câu 35. Trong kĩ thuật di truyền, để phân lập dòng tế bào chứa ADN tái tổ hợp người ta phải chọn thể truyền 
A): có khả năng tự nhân đôi với tốc độ cao.	
B): các dấu chuẩn hay gen đánh dấu, gen thông báo.
C): có khả năng tiêu diệt các tế bào không chứa ADN tái tổ hợp.
D): không có khả năng kháng được thuốc kháng sinh.
Câu 36. Ưu thế nổi bật của kĩ thuật di truyền là
A): sản xuất một loại prôtêin nào đó với số lượng lớn trong một thời gian ngắn.
B): khả năng cho tái tổ hợp thông tin di truyền giữa các loài rất xa nhau trong hệ thống phân loại.
C): tạo ra được các động vật chuyển gen mà các phép lai khác không thể thực hiện được
D):  tạo ra được các thực vật chuyển gen cho năng xuất rất cao và có nhiều đặc tính quí.
Câu 37. Một trong những ứng dụng của kỹ thuật di truyền là
A): sản xuất lượng lớn prôtêin trong thời gian ngắn.		
B): tạo thể song nhị bội.
C): tạo các giống cây ăn quả không hạt.				
D): tạo ưu thế lai.
Câu 38. Sinh vật chuyển gen là các cá thể
A): được chuyển gen từ loài khác vào cơ thể mình.
B): làm nhiệm vụ chuyển gen từ tế bảo của sinh vật này vào tế bào của sinh vật khác
C): được bổ sung vào bộ gen  của mình những gen đã tái tổ hợp hoặc đã được sữa chữa
D): được bổ sung vào bộ gen của mình những gen cho năng suất cao, phẩm chất tổt
Câu 39. Tạo sinh vật biến đổi gen bằng các phương pháp nào sau đây: 1. Đưa thêm gen lạ̣ vào hệ gen.  2. Thay thế nhân tế bào. 3. Làm biến đổi một gen đã có sẵn trong hệ gen               . 4. Lai hữu tính giữa các dòng thuần chủng. 5. Loại bỏ hoặc làm bất hoạt một gen nào đó trong hệ gen. Phương án đúng là 		
A): 1, 3, 5	
B): 1, 2, 5	
C): 3, 4, 5	
D): 2, 4, 5
Câu 40. Cho các bước tạo động vật chuyển gen: (1) Lấy trứng ra khỏi con vật. (2) Cấy phôi đã được chuyển gen vào tử cung con vật khác để nó mang thai và sinh đẻ bình thường. (3) Cho trứng thụ tinh trong ống nghiệm. (4) Tiêm gen cần chuyển vào hợp tử và hợp tử phát triển thành phôi. Trình tự đúng trong quy trình tạo động vật chuyển gen là
A): (1)  (4)  (3)  (2)	
B): (1)  (3)  (4)  (2) 
C): (2)  (3)  (4)  (2) 	
D): (3)  (4)  (2)  (1) 
Câu 41. Thành tựu nào sau đây không phải là thành tựu của tạo giống biến đổi gen
A): Tạo cừu biến đổi gen sản sinh prôtêin trong sữa
B): Tạo giống dâu tằm tam bội có năng suất lá cao dùng cho ngành chăn nuôi tằm 
C): Tạo chuột nhắt chứa gen hoocmôn sinh trưởng của chuột cống
D): Chuyển gen trừ sâu từ vi khuẩn vào cây bông , tạo được giống bông kháng sâu bệnh
Câu 42. Các bước tiến hành trong kĩ thuật chuyển gen theo trình tự là
A): tạo ADN tái tổ hợp→đưa ADN tái tổ hợp vào tế bào nhận→phân lập dòng tế bào chứa ADN tái tổ hợp
B): tách gen và thể truyền → cắt và nối ADN tái tổ hợp → đưa ADN tái tổ hợp vào tế bào nhận.
C): tạo ADN tái tổ hợp → phân lập dòng ADN tái tổ hợp → đưa ADN tái tổ hợp vào tế bào nhận.
D): phân lập dòng tế bào chứa ADN tái tổ hợp→tạo ADN tái tổ hợp→chuyển ADN tái tổ hợp vào TB nhận
CHỦ ĐỀ 6: DI TRUYỀN HỌC NGƯỜI
Câu 1. Đối với y học di truyền học có vai trò
A): Giúp y học tìm hiểu nguyên nhân, chẩn đoán và dự phòng  và điều trị một phần cho một số bệnh di truyền và một số các dị tật bẩm sinh trên người 
B): Giúp y học tìm hiểu nguyên nhân chuẩn đoán và dự phòng cho một số bệnh di truyền và một số các dị tật bẩm sinh trên người
C): Giúp y học tìm hiểu nguyên nhân và chuẩn đoán cho một số bệnh di truyền và một số bệnh tật bẩm sinh trên người
D): Giúp y học tìm hiểu nguyên nhân và cơ chế của một số bếnh di truyền trong những gia đình mang ĐB
Câu 2. Điều không đúng về nhiệm vụ của di truyền y học tư vấn là
A): góp phần chế tạo ra một số loại thuốc chữa bệnh di truyền.
B): chẩn đoán, cung cấp thông tin về khả năng mắc các loại bệnh DT ở đời con của các gia đình đã có bệnh này.
C): cho lời khuyên trong việc kết hôn, sinh đẻ.
D): cho lời khuyên trong việc đề phòng và hạn chế hậu quả xấu của ô nhiễm môi trường.
Câu 3. Phương pháp không được áp dụng trong nghiên cứu di truyền ở người là
A): phương pháp lai phân tích.					
B): phương pháp nghiên cứu phả hệ.
C): phương pháp nghiên cứu trẻ đồng sinh.			
D): phương pháp nghiên cứu tế bào.
Câu 4. Nguyên nhân của bệnh tật di truyền là:
A): Đột biến NST					
B): Đột biến gen     
C): Bất thường trong bộ máy di truyền     		 
D): Do bố và mẹ truyền cho con
Câu 5. Bệnh di truyền phân tử là những bệnh được nghiên cứu cơ chế 
A): gây đột biến ở mức độ phân tử		
B): gây bệnh ở mức độ phân tử      
C): gây đột biến ở mức độ tế bào			
D): gây bệnh ở mức độ tế bào.
Câu 6. Cơ chế gây bệnh di truyền phân tử là
A): alen đột biến có thể hoàn toàn không tổng hợp được prôtêin, tăng hoặc giảm số lượng prôtêin hoặc tổng hợp ra prôtêin bị thay đổi chức năng dẫn đến làm rối loạn cơ chế chuyển hoá của tế bào và cơ thể
B): đột biến đảo đoạn NST phát sinh làm ảnh hưởng tới prôtêin mà nó mang gen mã hoá như prôtêin không được tạo thành nữa, mất chức năng prôtêin hoặc làm prôtêin có chức năng khác thường và dẫn đến bệnh
C): đột biến lặp đoạn NST phát sinh làm ảnh hưởng tới prôtêin mà nó mang gen mã hoá như prôtêin không được tạo thành nữa, mất chức năng prôtêin hoặc làm prôtêin có chức năng khác thường và dẫn đến bệnh
D): đột biến mất đoạn nhỏ NST phát sinh làm ảnh hưởng tới prôtêin mà nó mang gen mã hoá như prôtêin không được tạo thành nữa, mất chức năng prôtêin hoặc làm prôtêin có chức năng khác thường và dẫn đến bệnh
Câu 7. Ở người, bệnh máu khó đông do đột biến gen lặn trên nhiễm sắc thể giới tính  X gây nên. Người phụ nữ bình thường nhưng mang gen gây bệnh kết hôn với người bình thường thì khả năng sinh con trai đầu lòng bị bệnh là
A): 50%.		
B): 25%.			
C): 75%.		
D): 0%.
Câu 8. Bệnh thiếu máu hồng cầu lưỡi liềm ở người do đột biến gen dạng:
A): Thay cặp T-A thành A-T dẫn đến thay thế axitamin Glutamic thành Valin
B): Thay cặp A-T thành T-A dẫn đến thay thế axitamin Glutamic thành Valin
C): Thay cặp T-A thành A-T dẫn đến thay thế axitamin Valin thành Glutamic
D): Thay cặp A-T thành T-A dẫn đến thay thế axitamin Valin thành Glutamic
Câu 9. Cho một số bệnh và hội chứng di truyền ở người: (1) Bệnh phêninkêto niệu; (2) Hội chứng Đao; (3) Hội chứng Tơcnơ; (4) Bệnh máu khó đông. Những bệnh hoặc hội chứng do đột biến gen là:
A): (2) và (3) 	
B): (1) và (2)	
C): (3) và (4)	
D): (1) và (4)
Câu 10. Khi nói về bệnh phêninkêto niệu ở người, phát biểu nào sau đây là đúng? 
A): Bệnh phêninkêto niệu là do lượng axit amin tirôzin dư thừa và ứ đọng trong máu, chuyển lên não gây đầu độc tế bào thần kinh. 
B): Có thể phát hiện ra bệnh phêninkêto niệu bằng cách làm tiêu bản tế bào và quan sát hình dạng nhiễm sắc thể dưới kính hiển vi. 
C): Chỉ cần loại bỏ hoàn toàn axit amin phêninalanin ra khỏi khẩu phần  ăn của người bệnh thì người bệnh sẽ trở nên khỏe mạnh hoàn toàn. 
D): Bệnh phêninkêto niệu là bệnh do đột biến ở gen mã hóa enzim xúc tác cho phản ứng chuyển hóa axit amin phêninalanin thành tirôzin trong cơ thể. 
Câu 11. Hội chứng bệnh liên quan đến đột biến NST là do
A): Đột biến mất đoạn NST		
B): Đột biến cấu trúc hay số lượng NST
C): Đột biến gen và đột biến NST 	
D): Đột biến mất đoạn NST, lặp đoạn NST
Câu 12. Vì sao nhiều tính trạng do đột biến NST được gọi là “hội chứng”?
A): Do trên NST có nhiều gen nên hầu hết đột biến NST làm ảnh hưởng đến nhiều tính trạng
B): Do đột biến NST thường không gây hậu quả nghiêm trọng
C): Do đột biến NST không di truyền thẳng		
D): Do đột biến NST có thể không di truyền 
Câu 13. Cho các tật và hội chứng di truyền sau đây ở người: (1)Tật dính ngón tay 2 và 3. (2)Hội chứng Đao. (3) Hội chứng Claiphentơ. (4) Hội chứng Etuôt
Các tật và hội chứng di truyền do đột biến xảy ra ở nhiễm sắc thể giới tính là
A): (2) và (4) 		
B): (2) và (3)		
C): (3) và (4)		
D): (1) và (3)
Câu 14. Cơ chế hình thành thể đột biến gây hội chứng XXX ở người:
A): Cặp NST XX không phân li trong giảm phân		
B): Cặp NST XX không phân li trong nguyên phân
C): Cặp NST XY không phân li trong giảm phân		
D): Cặp NST XY không phân li trong giảm phân
Câu 15. Di truyền y học đã chỉ ra nguyên nhân gây bệnh ung thư ở cơ chế phân tử đều liên quan tới biến đổi
A): cấu trúc của nhiễm sắc thể.	
B): cấu trúc của ADN. 	
C): số lượng nhiễm sắc thể.     
D): môi trường sống.
Câu 16. Ung thư là bệnh 
A): đặc trưng bởi sự tăng sinh không kiểm soát được của một số loại tế bào cơ thể, hình thành khối u chèn ép các cơ quan trong cơ thể.
B): lành tính, không di truyền do tế bào ung thư phân chia vô hạn tạo ra khối u, nhưng ít ảnh hưởng đến sức sống của cá  thể.
C): do tác nhân môi trường tạo ra: khí độc hại, hoá chất, virut gây ung thư.
D): ác tính và lành tính khi các tế bào khối u di căn vào máu và các nơi khác trong cơ thể, gây chết cho bệnh nhân.
Câu 17. U ác tính khác u lành như thế nào?
A): tăng sinh không kiểm soát được của một số loại tê bào
B): các tế bào của khối u có khả năng tách khỏi mô ban đầu di chuyển đến các nơi khác tạo nên nhiều khối u khác nhau
C): các tế bào của khối u không có khả năng tách khỏi mô ban đầu di chuyển đến các nơi khác tạo nên nhiều khối u khác nhau
D): tăng sinh có giới hạn của một số loại tế bào
Câu 18. Điều nào dưới đây không liên quan tới cơ chế gây ung thư
A): Các gen ức chế khối u bị đột biến không kiểm soát được sự phân bào
B): Các gen tiền ung thư khởi động quá trình phân bào bị đột biến và tạo cho sự phát triển bất bình thường của tế bào
C): hai loại gen tiền ung thư và ức chế khối u hoạt động không hài hòa với  nhau do ĐB xảy ra trong những gen này có thể phá hủy sự cân bằng, kiểm soát chu kì TB dẫn tới ung thư
D): hai loại gen: gen tiền ung thư và gen ức chế kối u hoạt động hài hòa với nhau trong việc kiểm soát chu kì TB
Câu 19. Nhiều loại bệnh ung thư xuất hiện là do gen tiền ung thư bị đột biến chuyển thành gen ung thư. Khi bị đột biến, gen này hoạt động mạnh hơn và tạo ra quá nhiều sản phẩm làm tăng tốc độ phân bào dẫn đến khối u tăng sinh quá mức mà cơ thể không kiểm soát được. Những gen ung thư loại này thường là
A): Gen trội và di truyền được vì chúng xuất hiện ở tế bào sinh dục
B): Gen trội và không di truyền được vì chúng xuất hiện ở tế bào sinh dưỡng
C): Gen lặn và di truyền được vì chúng xuất hiện ở tế bào sinh dục
D): Gen lặn và không di truyền được vì chúng xuất hiện ở tế bào sinh dưỡng
Câu 20. Biện pháp nào không phải là biện pháp bảo vệ vốn gen của loài người	
A): sử dụng liệu pháp gen.              			      
B): tư vấn di truyền và việc sàng lọc trước sinh
C): tạo môi trường sạch nhằm hạn chế các tác nhân đột biến.    
D): Cách chữa trị các bệnh di truyền
Câu 21. Khi nói về xét nghiệm trước sinh ở người, phát biểu nào sau đây không đúng?
A): Xét nghiệm trước sinh là những xét nghiệm để biết xem thai nhi có bị bệnh di truyền nào đó hay không
B): Xét nghiệm trước sinh đặc biệt hữu ích đối với một số bệnh di tuyền phân tử làm rối loạn quá trình chuyển hóa trong cơ thể
C): Xét nghiệm trước sinh được thực hiện bằng hai kĩ thuật phổ biến là chọc dò dịch ối và sinh thiết tua nhau thai.
D): Xét nghiệm trước sinh nhằm mục đích chủ yếu là xác định tình trạng sức khỏe của người mẹ trước khi sinh con.
Câu 22. Trong chẩn đoán trước sinh, kĩ thuật chọc dò dịch ối nhằm khảo sát:
A): tính chất của nước ối					
B): tế bào tử cung của người mẹ
C): tế bào thai bong ra trong nước ối		
D): tính chất của nước ối và tế bào tử cung của người mẹ
Câu 23. Liệu pháp gen là 
A): chữa trị các bệnh di truyền bằng cách phục hồi chức năng của các gen bị đột biến
B): phục hồi chức năng bình thường của tế bào hay mô, phục hồi sai hỏng di truyền.
C): nghiên cứu các giải pháp để sửa chữa hoặc cắt bỏ các gen gây bệnh ở người.
D): chuyển gen mong muốn từ loài này sang loài khác để tạo giống mới.
Câu 24. Điều không đúng về liệu pháp gen
A): việc chữa trị các bệnh di truyền bằng cách phục hồi chức năng các gen bị đột biến.
B): dựa trên nguyên tắc đưa bổ sung gen lành vào cơ thể vào cơ thể người bệnh.
C): có thể thay thế gen bệnh bằng gen lành
D): nghiên cứu hoạt động của bộ gen người để giải quyết các vần đề của y học
Câu 25. Chỉ số IQ là một chỉ số đánh giá 
A):  Số lượng nơron trong não bộ của con người. 	
B):  Sự trưởng thành của con người. 
C):  Chất lượng não bộ của con người 			
D):  Sự di truyền khả năng trí tuệ của con người  
Câu 26. Việc đánh giá sự di truyền khả năng trí tuệ dựa vào cơ sở nào 
A): Không dựa vào chỉ số IQ, cần tới những chỉ số hình thái giải phẫu cơ thể   
B): Cần kết hợp chỉ số IQ với các yếu tố khác 
C): Chỉ cần dựa vào chỉ số IQ       				
D): Dựa vào chỉ số IQ là thứ yếu
Câu 27. Vì sao HIV làm mất khả năng miễn dịch của cơ thể?
A): vì nó tiêu diệt tế bào hồng cầu               
B): vì nó tiêu diệt tế bào bạch cầu làm rối loạn chức năng của đại thực bào, bạch cầu đơn nhân
C): vì nó tiêu diệt tất cả các tế bào bạch cầu		
D): vì nó tiêu diệt các tế bào tiểu cầu
Câu 28. Vật chất di truyền trong hạt virut HIV ở người gồm:
A): Một phân tử ARN	    
B): Hai phân tử ARN	   
C): Một phân tử ADN		
D): Hai phân tử ADN
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
C): những biến đổi trên cơ thể sinh vật dưới tác động của ngoại cảnh và tập quán hoạt động nhưng DT được
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
Câu 16. Theo Đacuyn, chọn lọc dựa trên cơ sở: 1: di truyền; 2: biến dị; 3: đột biến	; 4: phân li tính trạng. Phát biểu đúng là:
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
A): hình thành các nhóm phân loại trên loài.				
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
Câu 30. Các nhân tố tiến hóa gồm: 1: đột biến ; 2: cách li ; 3:chọn lọc tự nhiên; 4:sinh sản ; 5: các yếu tố ngẫu nhiên ; 6: giao phối ngẫu nhiên ;7: giao phối không ngẫu nhiên ; 8: di nhập gen. Phát biểu đúng là
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
Câu 49. Trường hợp nào sau đây làm tăng độ đa dạng di truyền? 1: giao phối ngẫu nhiên; 2: giao phối không ngẫu nhiên ;  3: biến động di ; 4: đột biến ; 5: di nhập gen. Phát biểu đúng là:
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
Câu 53. Cách li trước hợp tử gồm:1: cách li nơi ở; 2: cách li cơ học; 3: cách li tập tính; 4: cách li không gian; 5: cách li sinh thái; 6: cách li thời gian (mùa vụ). Phát biểu đúng là:
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
C): thúc đẩy quá trình phân li tính trạng, củng cố sự phân hoá kiểu gen trong quần thể gốc
D): củng cố sự phân hoá kiểu gen trong quần thể gốc
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
CHỦ ĐỀ 8: SỰ PHÁT SINH VÀ PHÁT TRIỂN SỰ SỐNG TRÊN TRÁI ĐẤT
NGUỒN GỐC SỰ SỐNG
Câu 1. Trình tự các giai đoạn của tiến hoá:
A): hoá học- tiền sinh học- sinh học		
B): hoá học- sinh học- tiền sinh học
C): tiền sinh học- hoá học - sinh học		
D): tiền sinh học- sinh học - hóa học
Câu 2. Nhiều thí nghiệm đã chứng minh rằng các đơn phân nuclêôtit có thể tự lắp ghép thành những đoạn ARN ngắn,có thể nhân đôi mà không đến sự xúc tác của enzim. Điều này có ý nghĩa gì?
A): Cơ thể sống hình thành từ sự tương tác giữa prôtêin và axitnuclêic
B): Trong quá trình tiến hoá, ARN xuất hiện trước ADN và prôtêin 
C): Prôtêin có thể tự tổng hợp mà không cần cơ chế phiên mã và dịch mã
D): Sự xuất hiện các prôtêin và axitnuclêic chưa phải là xuất hiện sự sống
Câu 3. Sự tương tác giữa các đại phân tử nào dẫn đến hình thành sự sống?
A): Prôtêin-Prôtêin     
B): Prôtêin-axitnuclêic	
C): Prôtêin-saccarit	
D): Prôtêin-saccarit-axitnuclêic
Câu 4. Tiến hoá tiền sinh học là quá trình
A): hình thành tế bào sơ khai.				
B): hình thành các pôlipeptit từ các axitamin.
C): các đại phân tử hữu cơ.				
D): xuất hiện các nuclêôtit và saccarit.
Câu 5. Sự sống đầu tiên xuất hiện ở môi trường
A): khí quyển nguyên thuỷ.		
B): trong lòng đất và được thoát ra bằng các trận phun trào núi lửa
C): trong nước đại dương.		
D): trên đất liền
Câu 6. Dấu hiệu đánh dấu sự bắt đầu của giai đoạn tiến hoá sinh học là xuất hiện
A): quy luật chọn lọc tự nhiên.					
B): các hạt côaxecva
C): các hệ tương tác giữa các đại phân tử hữu cơ.			
D): các sinh vật đơn giản đầu tiên.
Câu 7. Trong điều kiện hiện nay của Trái Đất, chất hữu cơ được hình thành chủ yếu bằng cách nào?
A): Được tổng hợp trong các tế bào sống.		
B): Tổng hợp nhờ nguồn năng lượng tự nhiên.
C): Quang tổng hợp hay hoá tổng hợp.		
D): Tổng hợp nhờ công nghệ sinh học
Câu 8. Hoá thạch có ý nghĩa trong nghiên cứu sinh học và địa chất học như thế nào?
A): Hoá thạch chỉ là dẫn liệu quý để nghiên cứu lịch sử vỏ Trái Đất và lịch sử diệt vong của sinh vật.
B): Hoá thạch chỉ là dẫn liệu quý để nghiên cứu lịch sử vỏ Trái Đất.
C): Hoá thạch là dẫn liệu quý để nghiên cứu lịch sử vỏ Trái Đất và lịch sử phát sinh, phát triển và diệt vong của sinh vật.
D): Hoá thạch chỉ là dẫn liệu quý để nghiên cứu lịch sử phát sinh, phát triển của sinh vật.
Câu 9. Việc phân định các mốc thời gian địa chất căn cứ vào
A): tuổi của các lớp đất chứa các hoá thạch.    
B): những biến đổi về địa chất, khí hậu, hoá thạch điển hình
C): lớp đất đá và hoá thạch điển hình.	       
D): sự thay đổi khí hậu.
Câu 10. Sắp xếp đúng thứ tự các đại địa chất là
A): đại Nguyên Sinh, đại Thái cổ, đại Trung sinh, đại Cổ sinh, đại Tân sinh.
B): đại Cổ sinh, đại Thái cổ, đại Nguyên Sinh, đại Trung sinh, đại Tân sinh.
C): đại Thái cổ, đại Nguyên Sinh, đại Cổ sinh, đại Trung sinh, đại Tân sinh.
D): đại Nguyên Sinh, đại Thái cổ, đại Cổ sinh, đại Trung sinh, đại Tân sinh.
Câu 11. Sự kiện đáng chú ý nhất trong đại cổ sinh là gì?
A): Thực vật có hạt xuất hiện.		
B): Sự chinh phục đất liền của thực vật và động vật.
C): Phát sinh lưỡng cư, côn trùng.	
D): Sự xuất hiện bò sát.
Câu 12. Thực vật có hạt xuất hiện ở kỉ nào?
A): Pecmi.		
B): Xilua	
C): Đêvôn.		
D): Than đá.
Câu 13. Đặc điểm nổi bật của đại Trung sinh là
A): sự xuất hiện thực vật Hạt kín.			
B): sự phát triển ưu thế của Hạt trần và Bò sát.
C): sự xuất hiện Bò sát bay và Chim.		
D): cá xương phát triển, thay thế cá sụn.
Câu 14. Thực vật có hoa xuất hiện vào đại nào sau đây?
A): Đại Cổ sinh.					
B): Đại Trung sinh.
C): Đại Tân sinh.				
D): Đại Nguyên sinh, Thái cổ.
Câu 15. Đặc điểm nào sau đây không có ở kỉ Đệ Tam?
A): Cây hạt kín phát triển mạnh.			
B): Chim và thú phát triển mạnh.
C): Phát sinh các nhóm linh trưởng.		
D): Xuất hiện loài người.
Câu 16. Đặc điểm nào sau đây xuất hiện ở kỉ Đệ Tứ?
A): Ổn định hệ thực vật.				
B): Ổn định hệ động vật.
C): Sâu bọ phát triển mạnh.			
D): Xuất hiện loài người.
Câu 17. Trong các nhận xét sau, nhận xét không đúng về sự giống nhau giữa người và thú là
A): có lông mao, tuyến sữa, bộ răng phân hoá, có một số cơ quan lại tổ giống thú như có nhiều đôi vú,...
B): đẻ con, có nhau thai, nuôi con bằng sữa
C): giai đoạn phôi sớm ở người cũng có lông mao bao phủ toàn thân, có đuôi, có vài ba đôi vú.
D): có các cơ quan thoái hoá giống nhau.
Câu 18. Phát biểu nào sau đây là đúng:
A): Loài người có nguồn gốc sâu xa từ vượn người ngày nay
B): Loài người và vượn người ngày nay có chung nguồn gốc
C): Vượn người ngày nay là tổ tiên của loài người
D): Vượn người ngày nay tiến hoá thành loài người
Câu 19. Dạng vượn người có quan hệ họ hàng gần gũi với người nhất  là:
A): Tinh tinh.		
B): Đười ươi
C): Gôrila		
D): Khỉ đột.
Câu 20. Những điểm giống nhau giữa người và vượn người chứng tỏ người và vượn người
A): có quan hệ thân thuộc rất gần gũi.			
B): tiến hoá theo cùng một hướng.
C): tiến hoá theo hai hướng khác nhau.			
D): vượn người là tổ tiên của loài người.
Câu 21. Nội dung chủ yếu của thuyết “ ra đi từ Châu Phi” cho rằng
A): người H. sapiens hình thành từ loài người H. erectus ở châu Phi.
B): người H. sapiens hình thành từ loài người H. erectus ở các châu lục khác nhau.
C): người H. erectus di cư sang các châu lục khác sau đó tiến hóa thành H. sapiens.
D): người H. erectus được hình thành từ loài người H. habilis.
Câu 22. Khi nói về sự phát sinh loài người, điều nào sau đây chưa chính xác?
A): Loài người xuất hiện vào đầu kỉ đệ tứ ở đại tân sinh.
B): Vượn người ngày nay là tổ tiên của loài người.
C): Chọn lọc tự nhiên đóng vai trò quan trọng trong giai đoạn tiến hóa từ vượn người thành  người.
D): Có sự tiến hóa văn hóa trong xã hội loài người.
Câu 23. Những điểm khác nhau giữa người và vượn người chứng minh:
A): Tuy phát sinh từ 1 nguồn gốc chung nhưng người và vượn người tiến hoá theo 2 hướng khác nhau.
B): Người và vượn người không có quan hệ nguồn gốc
C): Vượn người ngày nay không phải là tổ tiên của loài người.
D): Người và vượn người có quan hệ gần gũi.
Câu 24. Đặc điểm của người khéo léo (H.habilis) là
A): não bộ khá phát triển và biết sử dụng công cụ bằng đá.
B): não bộ khá phát triển và chưa biết sử dụng công cụ bằng đá.
C): não bộ kém phát triển và biết sử dụng công cụ bằng đá.
D): não bộ kém phát triển và chưa biết sử dụng công cụ bằng đá.
Câu 25. Dáng đứng thẳng đã dẫn đến thay đổi quan trọng nào trên cơ thể người?
A): Giải phóng 2 chi trước khỏi chức năng vận chuyển.
B): Lồng ngực chuyển thành dạng uống cong.
C): Bàn chân có dạng vòm.
D): Bàn tay được hoàn thiện.
Câu 26. Trong quá trình phát sinh loài người, các nhân tố xã hội đóng vai trò chủ đạo từ giai đoạn
A): người tối cổ trở đi.					
B): vượn người hoá thạch trở đi.
C): người cổ trở đi.					
D): người hiện đại trở đi.
Câu 27. Nhân tố chính chi phối quá trình phát triển loài người ở giai đoạn người hiện đại là
A): thay đổi điều kiện địa chất, khí hậu ở kỉ Đệ tam.
B): lao động, tiếng nói, tư duy.
C): việc chế tạo và sử dụng công cụ lao động có mục đích.
D): quá trình biến dị di truyền và chọn lọc tự nhiên.
Câu 28. Loài người sẽ không biến đổi thành một loài nào khác, vì loài người
A): có khả năng thích nghi với mọi điều kiện sinh thái đa dạng, không phụ thuộc vào điều kiện tự nhiên và cách li địa lí.
B): đã biết chế tạo và sử dụng công cụ lao động theo những mục đích nhất định.
C): có hệ thần kinh rất phát triển.			
D): có hoạt động tư duy trừu tượng.
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
Câu 7. Cá rô phi nuôi ở nước ta có giới hạn sinh thái từ 5,6C đến 42C Điều giải thích nào dưới đây là đúng?
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
Câu 14. Những đặc điểm nào có thể có ở một quần thể sinh vật? 1. Quần thể bao gồm nhiều cá thể sinh vật; 2. Quần thể là tập hợp của các cá thể cùng loài; 3. Các cá thể trong quần thể có khả năng có khả năng sinh sản tạo thế hệ mới; 4. Quần thể gồm nhiều cá thể cùng loài phân bố ở các nơi xa nhau; 5. Các cá thể trong quần thể có kiểu gen hoàn toàn giống nhau; 6. cùng sống trong 1 khoảng không gian xác định, vào một thời điểm xác định. Tổ hợp câu đúng là
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
B): khi quần thể có nhiều cá thể bị đánh bắt quá mức
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
1. Có sự cạnh tranh gay gắt về nơi ở; 2. Tỉ lệ tử vong cao;  3. Mức sinh sản tăng;  4. Xuất cư tăng. Phương án trả lời đúng là
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
Câu 52. Các dạng biến động số lượng cá thể của quần thể là: 1. Biến động theo chu kì; 2. Biến động không theo chu kì; 3. Biến động nửa theo chu kì, nửa không theo chu kì; 4.Biến động tự do. Phương án trả lời đúng là
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
Câu 59. Sự biến động số lượng ruồi muỗi diễn ra hàng năm theo chu kì nào?
A): mùa		
B): ngày đêm		
C): tuần trăng			
D): nhiều năm.
CHỦ ĐỀ 10; QUẦN XÃ – HỆ SINH THÁI – SINH QUYỂN
Câu 1. Đặc điểm nào sau đây không phải của quần xã?
A): Quần xã là một tập hợp các quần thể sinh vật thuộc nhiều loài khác nhau, cùng sống trong một khoảng không gian nhất định (gọi là sinh cảnh).
B): Quần xã là một tập hợp các quần thể sinh vật thuộc cùng một loài, cùng sống trong một khoảng không gian nhất định (gọi là sinh cảnh).
C): Các sinh vật trong quần xã thích nghi với môi trường sống của chúng.
D): Các sinh vật trong quần xã có mối quan hệ gắn bó với nhau như một thể thống nhất và do vậy quần xã có cấu trúc tương đối ổn định.
Câu 2. Độ đa dạng của quần xã là
A): tỉ lệ % số địa điểm bắt gặp một loài trong tổng số địa điểm quan sát.
B): mức độ phong phú về số lượng loài trong quần xã và số lượng cá thể của mỗi loài.
C): mật độ cá thể của mỗi loài trong quần xã.
D): số loài đóng vai trò quan trọng trong quần xã.	
Câu 3. Trong quần xã, nhóm loài cho sản lượng sinh vật cao nhất thuộc về		
A): Động vật ăn cỏ				
B): Sinh vật ăn các chất mùn bã hữu cơ. 
C): Động vật ăn thịt				
D): Sinh vật tự dưỡng	
Câu 4. Quần xã sinh vật ở vùng nhiệt đới và vùng ôn đới nơi nào có độ đa dạng cao hơn và vì sao?
A): Vùng ôn đới, vì điều kiện sống ổn định.	     
B): Vùng nhiệt đới, vì lượng mưa khá cao và ổn định.
C): Vùng nhiệt đới, vì điều kiện sống không ổn định.     
D): Vùng ôn đới, lượng mưa khá cao và ổn định.
Câu 5. Loài ưu thế là loài có vai trò quan trọng trong quần xã do
A): số lượng cá thể nhiều.		
B): sức sống mạnh, sinh khối lớn, hoạt động mạnh.
C): có khả năng tiêu diệt các loài khác
D): số lượng cá thể nhiều, sinh khối lớn, hoạt động mạnh.
Câu 6. Loài đặc trưng trong quần xã là loài
A): chỉ có ở một quần xã hoặc có nhiều hơn hẳn các loài khác	  
B): có nhiều ảnh hưởng đến các loài khác
C): đóng vai trò quan trọng trong quần xã. 			 
D): phân bố ở trung tâm quần xã.
Câu 7. Các cây tràm ở rừng U minh là loài
A): ưu thế.		
B): đặc trưng.		
C): đặc biệt.		
D): có số lượng 
Câu 8. Muốn nuôi cá đạt năng suất cao và nuôi được nhiều cá thì:
A): Người ta chọn nuôi một loại cá trong ao để tránh sự cạnh tranh.
B): Nuôi nhiều loại cá, mỗi loài thích nghi ở một tầng nước khác nhau.
C): Nuôi một loại cá và thả thêm rong bèo để cung cấp đủ thức ăn.
D): Nuôi một loại cá và nuôi thêm cua, tôm.
Câu 9. Quan hệ giữa hai (hay nhiều) loài sinh vật, trong đó tất cả các loài đều có lợi, song mỗi bên chỉ có thể tồn tại được dựa vào sự hợp tác của bên kia là mối quan hệ nào?
A): Quan hệ hãm sinh.	     
B): Quan hệ cộng sinh.	 
C): Quan hệ hợp tác	   
D): Quan hệ hội sinh.
Câu 10. Trùng roi tricomonas sống trong ruột mối là quan hệ
A): Kí sinh. 		
B): cộng sinh. 		
C): hội sinh.		
D): hợp tác
Câu 11. Ví dụ nào sau đây phản ánh quan hệ hợp tác giữa các loài?
A): Vi khuẩn lam sống trong nốt sần rễ đậu.	
B): Chim sáo đậu trên lưng trâu rừng.
C): Cây phong lan bám trên thân cây gỗ.		
D): Cây tầm gửi sống trên thân cây gỗ.
Câu 12. Quan hệ giữa hai loài sinh vật diễn ra sự tranh giành nguồn sống là mối quan hệ nào?
A): Quan hệ cộng sinh.				
B): Quan hệ vật chủ - vật kí sinh.
C): Quan hệ hợp tác				
D): Quan hệ cạnh tranh.
Câu 13. Dây tơ hồng sống trên các tán cây trong rừng là ví dụ về mối quan hệ nào?
A): Cộng sinh.		
B): Cạnh tranh.		
C): Kí sinh.		
D): Hội sinh.
Câu 14. Quan hệ giữa hai loài sinh vật, trong đó một loài này sống bình thường, nhưng gây hại cho nhiều loài khác là mối quan hệ nào?
A): Quan hệ cộng sinh.				
B): Quan hệ ức chế- cảm nhiễm.
C): Quan hệ hợp tác			
D): Quan hệ hội sinh.
Câu 15. Các loài gần nhau về nguồn gốc, khi sống trong một sinh cảnh và cùng sử dụng một nguồn thức ăn, để tránh sự cạnh tranh xảy ra thì chúng  thường có xu hướng :
A): phân li ổ sinh thái	
B): phân li nơi ở            
C): thay đổi nguồn thức ăn 	    
D): di cư đi nơi khác
Câu 16. Hiện tượng khống chế sinh học trong quần xã biểu hiện ở
A): số lượng cá thể trong quần xã luôn được khống chế ở mức độ cao phù hợp với khả năng cung cấp nguồn sống của môi trường.
B): số lượng cá thể trong quần xã luôn được khống chế ở mức độ tối thiểu phù hợp với khả năng cung cấp nguồn sống của môi trường.
C): số lượng cá thể trong quần xã luôn được khống chế ở mức độ nhất định (dao động quanh vị trí cân bằng) do sự tác động của các mối quan hệ hoặc hỗ trợ hoặc đối kháng giữa các loài trong quần xã.
D): số lượng cá thể trong quần xã luôn được khống chế ở mức độ nhất định gần phù hợp với khả năng cung cấp nguồn sống của môi trường.
Câu 17. Hiện tượng khống chế sinh học trong quần xã dẫn đến 
A): Sự tiêu diệt của một loài nào đó trong quần xã 
B): Sự phát triển một loài nào đó trong quần xã 
C): Trạng thái cân bằng sinh học trong quần xã 		
D): Làm giảm độ đa dạng sinh học của quần xã 
Câu 18. Diễn thế sinh thái là
A): quá trình biến đổi của quần xã tương ứng với sự biến đổi của môi trường.
B): quá trình biến đổi của quần xã qua các giai đoạn, tương ứng với sự biến đổi của môi trường.
C): quá trình biến đổi tuần tự của quần xã qua các giai đoạn, tương ứng với sự biến đổi của môi trường.
D): quá trình biến đổi tuần tự của quần xã qua các giai đoạn, từ lúc khởi đầu đến khi kết thúc
Câu 19. Cho các giai đoạn của diễn thế nguyên sinh: (1) Môi trường chưa có sinh vật. (2) Giai đoạn hình thành quần xã ổn định tương đối (giai đoạn đỉnh cực); (3) Các sinh vật đầu tiên phát tán tới hình thành nên quần xã tiên phong. (4) Giai đoạn hỗn hợp (giai đoạn giữa) gồm các quần xã biến đổi tuần tự, thay thế lẫn nhau. Diễn thế nguyên sinh diễn ra theo trình tự là:
A): (1), (2), (4), (3)	  
B): (1), (2), (3), (4)	     
C): (1), (4), (3), (2)	        
D): (1), (3), (4),( 2)
Câu 20. Diễn thế thứ sinh xảy ra:
A): trên môi trường mà trước đây từng tồn tại một quần xã, nhưng nay đã bị huỷ diệt chưa hoàn toàn.
B): trên môi trường mà trước đây từng tồn tại một quần xã, nhưng nay đã bị huỷ diệt hoàn toàn.
C): trên môi trường mà trước đây từng tồn tại một quần xã, sau đó lần lượt được thay thế các quần xã khác
D): trên môi trường tồn tại một quần xã tiên phong, nhưng nay đã bị huỷ diệt hoàn toàn.
Câu 21. Cho các thông tin về diễn thế sinh thái như sau : (1 ) Xuất hiện ở mội trường đã có một quần xã sinh vật từng sống. (2) Có sự biến đổi tuần tự của quần xã qua các giai đoạn tương ứng với sự biến đổi của môi trường. (3) Song song với quá trình biến đổi quần xã trong diễn thế là quá trình biến đổi về các điều kiện tự nhiên của môi trường. (4) Luôn dẫn tới quần xã bị suy thoái. Các thông tin phản ánh sự giống nhau giữa diễn thế nguyên sinh và diễn thế thứ sinh là
A): (1) và (4).               
B): (3) và (4).                      
C): (1) và  (2).                 
D): (2) và (3).
Câu 22. Diễn thế ở một đầm nước nông diễn ra như thế nào?
A): Một đầm nước mới xây dựng   trong đầm có nhiều loài thuỷ sinh ở các tầng nước khác nhau  đáy đầm bị nông dần có cỏ và cây bụi   vùng đất trũng có các loài thực vật sống   rừng cây bụi và cây gỗ.
B): Một đầm nước mới xây dựng   trong đầm có nhiều loài thuỷ sinh ở các tầng nước khác nhau  đáy đầm bị nông dần có cỏ và cây bụi   vùng đất trũng có cỏ và cây bụi   rừng cây bụi và cây gỗ.
C): Một đầm nước mới xây dựng   trong đầm có nhiều loài thực vật sống  đáy đầm bị nông dần có nhiều loài thuỷ sinh ở các tầng nước khác nhau   vùng đất trũng có cỏ và cây bụi  rừng cây bụi và cây gỗ.
D): Một đầm nước mới xây dựng   trong đầm có nhiều loài thuỷ sinh ở các tầng nước khác nhau  đáy đầm bị nông dần có các loài thực vật sống   vùng đất trũng có cỏ và cây bụi   rừng cây bụi và cây gỗ.
Câu 23. Sơ đồ diễn thế sinh thái tại một khu rừng lim như sau: Rừng lim nguyên sinh → Rừng thưa → Cây gỗ nhỏ và cây bụi → Cây bụi và cỏ → Trảng cỏ. Đây là loại diễn thế sinh thái
A): thứ sinh		.	
B): nguyên sinh.			
C): phân hủy.			
D): hỗn hợp.
Câu 24. Diễn thế nguyên sinh thường dẫn đến kết quả cuối cùng là
A): hình thành quần xã suy thoái.					
B): hình thành quần xã ổn định.
C): vùng đất trống, đồi trọc						
D): hình thành quần xã không ổn định.
Câu 25. Tầm quan trọng của việc nghiên cứu diễn thế sinh thái như thế nào?
A): Có thể kịp thời đề xuất các biện pháp khắc phục những biến đổi bất lợi của môi trường, sinh vật, con người.
B): Có thể khai thác hợp lí các nguồn tài nguyên thiên nhiên và khắc phục những biến đổi bất lợi của môi trường.
C): Có thể chủ động điều khiển diễn thế sinh thái hoàn toàn theo ý muốn của con người.
D): Có thể hiểu biết được các quy luật phát triển của quần xã sinh vật, dự đoán được các quần xã xuất hiện trước đó và quần xã sẽ thay thế trong tương lai.
Câu 26. Hệ sinh thái bao gồm
A): các sinh vật luôn luôn tác động lẫn nhau.
B): quần xã sinh vật và sinh cảnh của quần xã (môi trường vô sinh của quần xã).
C): các loài quần tụ với nhau tại một không gian xác định.
D): các tác động của các nhân tố vô sinh lên các loài.
Câu 27. Hệ sinh thái là một hệ thống sinh học hoàn chỉnh và tương đối ổn định vì
A): các sinh vật trong quần xã luôn tác động với các thành phần vô sinh của sinh cảnh
B): các sinh vật trong quần xã luôn tác động với nhau
C): các sinh vật trong quần xã luôn tác động lẫn nhau và đồng thời tác động qua lại với các thành phần vô sinh của sinh cảnh
D): các sinh vật trong quần xã luôn tác động với nhau và với các quần thể khác cùng loài
Câu 28. Hệ sinh thái biểu hiện chức năng của một tổ chức sống như thế nào?
A): Biểu hiện sự trao đổi chất và năng lượng giữa các sinh vật trong nội bộ quần xã.
B): Biểu hiện sự trao đổi chất và năng lượng giữa các sinh vật trong nội bộ quần xã và giữa quần xã với sinh cảnh của chúng.
C): Biểu hiện sự trao đổi chất và năng lượng giữa quần xã với sinh cảnh của chúng.
D): Biểu hiện sự trao đổi chất và năng lượng giữa các sinh vật trong nội bộ quần thể và giữa quần thể với sinh cảnh của chúng.
Câu 29. Nội dung nào sau đây sai?
A): Kích thước của một hệ sinh thái rất đa dạng              
B): Hệ sinh thái lớn nhất là Trái Đất
C): Bất kì một sự gắn kết nào giữa các sinh vật với nhân tố sinh thái của môi trường để tạo thành một chu trình sinh học hoàn chỉnh đều được coi là một hệ sinh thái
D): Một giọt nước ao không được coi là hệ sinh thái
Câu 30. Một hệ sinh thái điển hình được cấu tạo đầy đủ bởi các yếu tố nào?
A): sinh vật sản xuất, sinh vật tiêu thụ, sinh vật phân giải, các chất vô cơ, các yếu tố khí hậu.
B): sinh vật sản xuất, sinh vật tiêu thụ, sinh vật phân giải, các chất vô cơ, các chất hữu cơ và các yếu tố khí hậu.
C): sinh vật sản xuất, sinh vật tiêu thụ, sinh vật phân giải, các chất vô cơ, các chất hữu cơ.
D): sinh vật sản xuất, sinh vật tiêu thụ, sinh vật phân giải, các chất hữu cơ và các yếu tố khí hậu.
Câu 31. Trong hệ sinh thái, thành phần hữu sinh bao gồm các yếu tố nào?
A): Sinh vật tiêu thụ, sinh vật phân giải, các chất hữu cơ.
B): Sinh vật sản xuất, sinh vật tiêu thụ, sinh vật phân giải.
C): Sinh vật sản xuất, sinh vật tiêu thụ, các chất hữu cơ.
D): Sinh vật sản xuất, sinh vật phân giải, các chất hữu cơ.
Câu 32. Khi nói về hệ sinh thái tự nhiên, phát biểu nào sau đây không đúng? 
A): Trong các hệ sinh thái trên cạn, sinh vật sản xuất gồm thực vật và vi sinh vật tự dưỡng.
B): Các hệ sinh thái tự nhiên được hình thành bằng các quy luật tự nhiên và có thể bị biến đổi dưới tác động của con người.
C): Các hệ sinh thái tự nhiên dưới nước chỉ có một loại chuỗi thức ăn được mở đầu bằng sinh vật sản xuất.
D): Các hệ sinh thái tự nhiên trên Trái Đất rất đa dạng, được chia thành các nhóm hệ sinh thái trên cạn và các nhóm hệ sinh thái dưới nước
Câu 33. Điểm khác nhau cơ bản của hệ sinh thái nhân tạo so với hệ sinh thái tự nhiên là ở chỗ:
A): Hệ sinh thái nhân tạo là một hệ mở còn hệ sinh thái tự nhiên là một hệ khép kín.
B): Hệ sinh thái nhân tạo có độ đa dạng sinh học cao hơn so với hệ sinh thái tự nhiên.
C): Do có sự can thiệp của con người nên hệ sinh thái nhân tạo có khả năng tự điều chỉnh cao hơn so với hệ sinh thái tự nhiên.
D): Để duy trì trạng thái ổn định của hệ sinh thái nhân tạo, con người thường bổ sung năng lượng cho chúng.
Câu 34. Cơ sở để xây dựng chuỗi và lưới thức ăn trong QXSV là mối quan hệ	
A): về nơi sống giữa các quần thể trong quần xã		
B): về sinh sản giữa các cá thể trong quần thể
C): về sự gỗ trợ giữa các loài				
D): dinh dưỡng giữa các loài trong quần xã
Câu 35. Trao đổi chất trong quần xã được biểu hiện qua
A): trao đổi vật chất giữa các sinh vật và giữa quần xã với sinh cảnh.	
B): chuỗi và lưới thức ăn.
C): trao đổi vật chất giữa quần xã với môi trường vô sinh.	       
D): chu trình trao đổi các chất trong tự nhiên.
Câu 36. Chuỗi thức ăn là một dãy gồm nhiều loài sinh vật có quan hệ
A): dinh dưỡng với nhau và mỗi loài là một mắt xích của chuỗi
B): mật thiết với nhau về thức ăn, nơi ở
C): dinh dưỡng với nhau và mỗi loài là một mắt xích, vừa là sinh vật tiêu thụ mắt xích phía trước, vừa là sinh vật bị mắt xích phía sau tiêu thụ.
D): dinh dưỡng với nhau.
Câu 37. Đa dạng sinh học là
A): sự phong phú về thành phần loài                                          
B): sự đa dạng các hệ sinh thái
C): sự đa dạng về môi trường sống của các loài sinh vật
D): sự phong phú về nguồn gen, về loài và các hệ sinh thái trong tự nhiên
Câu 38. Trật tự nào sau đây là không đúng với chuỗi thức ăn?
A): Cây xanh   Chuột   Mèo   Diều hâu.		
B): Cây xanh   Chuột   Cú   Diều hâu.
C): Cây xanh   Rắn   Chim   Diều hâu.		
D): Cây xanh   Chuột   Rắn   Diều hâu.
Câu 39. Phát biểu đúng về lưới thức ăn
A): Quần xã phải đa dạng mới tạo thành lưới thức ăn.
B): Các chuỗi thức ăn có mắt xích chung gọi là lưới thức ăn.
C): Nhiều chuỗi thức ăn mới tạo thành lưới thức ăn.
D): Nhiều quần thể trong quần xã mới tạo thành lưới thức ăn.
Câu 40. Các loài có cùng bậc dinh dưỡng là các loài có cùng
A): số lượng cá thể và cùng sử dụng một loại thức ăn.
B): mức năng lượng và sử dụng thức ăn cùng mức năng lượng.
C): sinh khối và sử dụng thức ăn cùng sinh khối.
D): số lượng loài sử dụng thức ăn cùng bậc dinh dưỡng.
Câu 41. Cho chuỗi thức ăn :  Lúa → Châu chấu → Ếch → Rắn → Đại bàng. Ếch trong chuỗi thức ăn thuộc bậc dinh dưỡng
A): 4                   	
B): 2 			
C): 3                                     
D): 5.
Câu 42. Xây dựng tháp sinh thái nhằm
A): mô tả các mối quan hệ trong quần xã                       	
B): tìm hiểu quy luật phát triển của quần xã
C): tìm hiểu sự biến động số lượng cá thể  của quần xã	
D): xem xét mức độ dinh dưỡng ở từng bậc và toàn bộ quần xã.
Câu 43. Tháp năng lượng được xây dựng dựa trên
A): số năng lượng được tích luỹ chỉ trên một đơn vị diện tích, trong một đơn vị thời gian, ở mỗi bậc dinh dưỡng.
B): số năng lượng được tích luỹ trên một đơn vị thời gian, ở mỗi bậc dinh dưỡng.
C): số năng lượng được tích luỹ trên một đơn vị diện tích hay thể tích, trong một đơn vị thời gian, ở mỗi bậc dinh dưỡng.
D): số năng lượng được tích luỹ chỉ trên một đơn vị thể tích, trong một đơn vị thời gian, ở mỗi bậc dinh dưỡng.
Câu 44. Tháp hoàn thiện nhất là
A): tháp năng lượng.				
B): tháp năng lượng và tháp số lượng.
C): tháp năng lượng và sinh khối.			
D): tháp sinh khối và tháp số lượng.
Câu 45. Theo quy luật hình tháp thì sinh vật nào
A): càng gần vị trí của sinh vật sản xuất thì nguồn thức ăn càng phong phú
B): càng gần vị trí của sinh vật sản xuất thì nguồn thức ăn càng khan hiếm
C): càng xa vị trí của sinh vật sản xuất thì nguồn thức ăn càng phong phú
D): càng xa vị trí của sinh vật sản xuất thì có sinh khối trung bình càng nhỏ
Câu 46. Quan hệ dinh dưỡng giữa các loài trong quần xã cho chúng ta biết 
A): cho ta biết mức độ gần gũi giữa các cá thể trong quần xã.
B): cho ta biết dòng năng lượng trong quần xã.
C): tất cả các động vật đều trực tiếp hoặc gián tiếp phụ thuộc vào thực vật..
D): từ lượng thức ăn sử dụng ở mỗi bậc dinh dưỡng sẽ xác định được sinh khối của quần xã.
Câu 47. Chu trình sinh địa hoá là chu trình
A): phân giải các chất trong tự nhiên                              	
B): tổng hợp các chất trong tự nhiên      
C): trao đổi các chất trong tự nhiên                               	
D): tuần hoàn vật chất trong tự nhiên
Câu 48. Chu trình sinh địa hoá có vai trò
A): duy trì sự cân bằng vật chất trong sinh quyển.
B): duy trì sự cân bằng năng lượng trong sinh quyển.
C): duy trì sự cân bằng vật chất và năng lượng trong sinh quyển.
D): duy trì sự cân bằng trong quần xã.
Câu 49. Khi nói về chu trình cacbon, phát biểu nào sau đây không đúng?
A): Trong quần xã, hợp chất cacbon được trao đổi thông qua chuỗi và lưới thức ăn
B): Không phải tất cả lượng cacbon của quần xã sinh vật được trao đổi liên tục theo vòng tuần hoàn kín
C): Cacbon từ môi trường ngoài vào quần xã sinh vật chủ yếu thông qua quá trình quang hợp
D): Khí CO2 trở lại môi trường hoàn toàn do hoạt động hô hấp của động vật
Câu 50. Khi nói về chu trình sinh địa hóa nitơ, phát biểu nào sau đây không đúng?
A): Động vật có xương sống có thể hấp thu nhiều nguồn nitơ như muối amôn ( ) , nitrat ( )
B): Vi khuẩn phản nitrat hoá có thể phân huỷ nitrat ( ) thành nitơ phân tử (N2)
C): Một số loài vi khuẩn, vi khuẩn lam có khả năng cố định nitơ từ không khí.
D): Thực vật hấp thụ nitơ dưới dạng muối , như muối amôn ( ) , nitrat ( ).
Câu 51. Loài nào không có khả năng cố định nitơ từ không khí?
A): Vi khuẩn nốt  sần cộng sinh với cây họ Đậu.	 
B): Một số vi khuẩn sống tự do trong đất và nước
C): vi khuẩn lam trên với bèo hoa dâu		  
D): vi khuẩn phản nitrat
Câu 52. Sinh quyển là
A): những sinh vật sống trong các lớp đất, nước của trái đất
B): gồm toàn bộ sinh vật sống trong các lớp đất, nước, không khí của trái đất
C): những sinh vật sống trong các lớp nước, không khí
D): những sinh vật sống trong các lớp đất, không khí
Câu 53. Sinh quyển được chia thành nhiều khu sinh học, đó là
A): các khu rừng nhiệt đới, rừng rụng lá ôn đới, rừng lá kim và vùng đại dương.
B): toàn bộ các khu sinh học trên cạn, khu sinh học nước ngọt và khu sinh học biển.
C): toàn bộ các khu sinh học trên cạn phân bố theo vĩ độ và mức khô hạn của các vùng trên Trái Đất.
D): toàn bộ các hồ, ao... và các khu nước chảy là các sông, suối.
Câu 54. Khu sinh học nào là lá phổi xanh của hành tinh?
A): Khu sinh học rừng lá rộng rụng theo mùa và rừng hỗn tạp ôn đới Bắc Bán Cầu.
B): Khu sinh học rừng xanh nhiệt đới.
C): Khu sinh học rừng lá kim phương bắc
D): Khu sinh học đồng rêu.
Câu 55. Nguồn cung cấp năng lượng chủ yếu cho sự sống trên trái đất là năng lượng
A): trong các phản ứng hoá học     
B): ánh sáng mặt trời	    
C): do núi lửa hoạt động             
D): do sóng biển
Câu 56. Dòng năng lượng trong hệ sinh thái diễn ra như thế nào?
A): bắt nguồn từ môi trường, được sinh vật sản xuất hấp thụ và biến đổi thành quang năng, sau đó năng lượng được truyền qua các bậc dinh dưỡng và cuối cùng năng lượng truyền trở lại môi trường.
B): bắt nguồn từ môi trường, được sinh vật sản xuất hấp thụ và biến đổi thành năng lượng hoá học, sau đó năng lượng được truyền hết qua các bậc dinh dưỡng.
C): từ sinh vật sản xuất hình thành năng lượng hoá học, sau đó năng lượng được truyền qua các bậc dinh dưỡng và cuối cùng năng lượng truyền trở lại môi trường.
D): bắt nguồn từ môi trường, được sinh vật sản xuất hấp thụ và biến đổi thành năng lượng hoá học, sau đó năng lượng được truyền qua các bậc dinh dưỡng và cuối cùng năng lượng truyền trở lại môi trường.
Câu 57. Điều nào sau đây không đúng với dòng năng lượng trong hệ sinh thái?
A): Càng lên bậc dinh dưỡng cao hơn năng lượng càng tăng dần.
B): Năng lượng truyền qua các bậc dinh dưỡng từ thấp lên cao.
C): Năng lượng bị thất thoát dần qua các bậc dinh dưỡng.
D): Càng lên bậc dinh dưỡng cao hơn năng lượng càng giảm dần.
Câu 58. Nguyên nhân chính gây ra thất thoát năng lượng trong hệ sinh thái là do:
A): Sinh vật bậc dinh dưỡng sau không sử dụng hết sinh vật bậc dinh dưỡng trước
B): Năng lượng bị mất qua hô hấp, tạo nhiệt, chất thải.
C): Năng lượng tích lũy vào bậc dinh dưỡng cao ít hơn bậc dinh dưỡng trước
D): Năng lượng bị mất qua hoạt động kiếm ăn, trốn kẻ thù.
Câu 59. Trong hệ sinh thái
A): năng lượng được truyền theo một chiều từ sinh vật sản xuất qua các bậc dinh dưỡng tới môi trường, còn vật chất được trao đổi qua chu trình dinh dưỡng.
B): năng lượng và vật chất được trao đổi qua chu trình dinh dưỡng
C): năng lượng được truyền theo một chiều từ sinh vật sản xuất qua các bậc dinh dưỡng tới môi trường
D): vật chất được truyền theo một chiều từ sinh vật sản xuất qua các bậc dinh dưỡng tới môi trường, còn năng lượng được trao đổi qua chu trình dinh dưỡng.
Câu 60. Cho các nhóm sinh vật trong một hệ sinh thái: (1) Động vật ăn động vật;(2) Động vật ăn thực vật; (3) Sinh vật sản xuất.Sơ đồ thể hiện đúng thứ tự truyền của dòng năng lượng qua các bậc dinh dưỡng trong hệ sinh thái là 
A): (2)→(3)→(1)                 
B): (1)→(3)→(2)               
C): (1)→(2)→(3)            
D): (3)→(2)→(1)
Câu 61. Chuỗi thức ăn trong hệ sinh thái không thể kéo dài (quá 6 mắt xích) vì
A): năng lượng được hấp thụ nhiều ở sinh vật tiêu thụ
B): năng lượng được hấp thụ ở sinh vật sản xuất là quá ít, không đủ để cung cấp cho các bậc dinh dưỡng cao hơn
C): năng lượng mất qua lớn qua các bậc dinh dưỡng nên càng lên bậc dinh dưỡng cao năng lượng tích luỹ càng ít dần
D): năng lượng được hấp thụ nhiều ở sinh vật sản xuất
Câu 62. Nhóm sinh vật nào sau đây tạo ra sản lượng sơ cấp ?
A): Động vật ăn thực vật            
B): Thực vật     	
C): Động vật ăn động vật           
D): Sinh vật phân giải
Câu 63. Trong hệ sinh thái, sinh vật đóng vai trò quan trọng trong việc truyền năng lượng từ môi trường vô sinh tới môi trường dinh dưỡng là
A): sinh vật tiêu thụ          
B): sinh vật sản xuất            
C): sinh vật phân huỷ              
D): sinh vật tiêu thụ cấp 1
Câu 64. Hiệu suất sinh thái là
A): tỷ lệ % chuyển hoá năng lượng giữa các bậc dinh dưỡng đầu tiên và cuối cùng trong hệ sinh thái.
B): tổng tỷ lệ % chuyển hoá năng lượng giữa các bậc dinh dưỡng trong hệ sinh thái.
C): tỷ lệ % chuyển hoá năng lượng giữa các bậc dinh dưỡng của sinh vật sản xuất và sinh vật tiêu thụ bậc một trong hệ sinh thái.
D): tỷ lệ % chuyển hoá năng lượng giữa các bậc dinh dưỡng trong hệ sinh thái.
Câu 65. Tài nguyên tái sinh là
A): dạng tài nguyên sau một thời gian sử dụng có khả năng phục hồi  trở lại
B): những tài nguyên sử dụng hợp lý sẽ có điều kiện phát triển phục hồi
C): dạng tài nguyên không bao giời cạn kiệt
D): dạng tài nguyên nếu sử dụng hợp lý thì khả năng cạn kiệt thấp
Câu 66. Tài nguyên nào sau đây thuộc tài nguyên tái sinh? 1. Nhiên liệu hoá thạch; 2. Năng lượng; 3. Nước sạch, không khí sạch; 4. Đất;5. Kim loại, phi kim;  6. Đa dạng sinh học. Phương án đúng là:
A): 1, 2, 3                     
B): 1, 3, 5                     
C): 3, 4, 6                    
D): 2, 3, 6
Câu 67. Tài nguyên nào sau đây thuộc dạng tài nguyên vĩnh cửu? 1. Đất; 2. Nước sạch; 3. Năng lượng ánh sáng; 4. Năng lượng gió; 5. Than đá;  6. Dầu mỏ ; 7. Năng lượng thuỷ triều. Phương án đúng là:
A): 1, 2, 7                     
B): 3, 4, 7                     
C): 5, 6, 7                     
D): 1, 2, 3
Câu 68. Điều nào dưới đây không phải  là nguyên nhân chủ yếu làm suy thoái các dạng tài nguyên?
A): trong khai thác, con người làm khánh kiệt các dạng tài nguyên không tái sinh.
B): những tai biến do thiên nhiên tạo ra: bão lụt, hạn hán, động đất.
C): trong khai thác, con người làm suy thoái nghiêm trọng các dạng tài nguyên có khả năng phục hồi.
D): Trong khai thác, con người đã làm giảm sự đa dạng sinh học
Câu 69. Biện pháp quan trọng để sử dụng hợp lí nguồn tài nguyên nước là
A): tiết kiệm nước trong việc ăn uống.		
B): tiết kiệm trong việc tưới tiêu cho cây trồng.
C): hạn chế nước ngọt chảy ra biển.		
D): không làm ô nhiễm và cạn kiệt nguồn nước
Câu 70. Sử dụng bền vững tài nguyên thiên nhiên là hình thức sử dụng
A): vừa thoả mãn nhu cầu hiện tại của con người để phát triển xã hội, vừa đảm bảo duy trì lâu dài các tài nguyên thiên nhiên cho thế hệ sau
B): tiết kiệm nguồn tài nguyên thiên nhiên để đảm bảo thế hệ sau có thể tiếp tục sử dụng
C): tiết kiệm để tạo điều kiện cho nguồn tài nguyên tái sinh
D): vừa thoả mãn nhu cầu hiện tại của con người để phát triển xã hội, vừa tạo điều kiện cho các nguồn tài nguyên tái sinh để thế hệ sau sử dụng
Câu 71.  Nguyên nhân chủ yếu gây ô nhiễm môi trường là
A): bão lụt tạo điều kiện cho sinh vật gây bệnh phát triển       
B): núi lửa phun nham thạch      
C): do phương tiện giao thông               	           
D): chất thải từ quá trình sản xuất và sinh hoạt của con người
Câu 72. Nguyên nhân dẫn đến hiệu ứng nhà kính ở Trái đất là
A): do đốt quá nhiều nhiên liệu hoá thạch và do thu hẹp diện tích rừng
B): do thảm thực vật có xu hướng giảm dần quang hợp và tăng dần hô hấp vì có sự thay đổi khí hậu
C): do động vật được phát triển nhiều nên làm tăng lượng CO2 qua hô hấp
D): do bùng nổ dân số nên làm tăng lượng khí CO2 qua hô hấp
Câu 73. Về nguồn gốc hệ sinh thái được phân thành các kiểu
A): Các hệ sinh thái tự nhiên và nhân tạo.		
B): Các hệ sinh thái rừng và biển.
C): Các hệ sinh thái lục địa và đại dương.		
D): Các hệ sinh thái trên cạn và dưới nước
`;

function start() {
    qss = [];
    document.getElementById("res").innerHTML = "";
    document.getElementById("qmain").innerHTML = "";
    renderQ(lgen())
}