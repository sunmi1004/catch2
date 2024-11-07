const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const mongoose = require("mongoose");
const { Script } = require("vm");
require("dotenv").config();

const app = express();
const port = 3000;
app.use(express.json());

// MongoDB 연결
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User 스키마 및 모델 정의
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

const cardSchema = new mongoose.Schema({
  url: { type: String, required: true },
  deadline: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String },
  period: { type: String },
});

const Card = mongoose.model("Card", cardSchema);
const cards = [
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102501",
    deadline: "2024.11.08",
    title: "[인천] 2024년 기업수요맞춤형 기술개발사업 추가 모집 공고",
    location: "인천",
    period: "2024.10.28 ~ 2024.11.08",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102519",
    deadline: "2024.11.15",
    title: "[충남] 서천군 2025년 청년어촌 정착지원 사업대상자 모집 공고",
    location: "충남",
    period: "2024.10.24 ~ 2024.11.15",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102520",
    deadline: "2024.12.12",
    title:
      "[경남] 2024년 현장실습 지원사업 표준현장실습 계절제(동계) 참여기업 모집 공고",
    location: "경남",
    period: "2024.10.30 ~ 2024.12.12",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102527",
    deadline: "2024.11.29",
    title:
      "[대구] 2024년 대구산단 화재 초기진압을 위한 부착형 소화패치 지원사업 수요기업 모집 공고",
    location: "대구",
    period: "2024.10.30 ~ 2024.11.29",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102532",
    deadline: "2024.11.22",
    title: "[부산] 영도구 2024년 소규모어가 직불제 사업 추가 신청 공고",
    location: "경기",
    period: "2024.10.30 ~ 2024.11.22",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102534",
    deadline: "2024.12.31",
    title: "[경기] 남양주시 2025년 유기농업자재 지원사업 신청 공고",
    location: "경기",
    period: "2024.11.01 ~ 2024.12.31",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102553",
    deadline: "2024.11.13",
    title: "[경북] 2024년 경북지역센터 가치만드소 기업 지원사업 공고",
    location: "경북",
    period: "2024.11.01 ~ 2024.11.13",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102547",
    deadline: "2024-11-22",
    title:
      "[서울] 2024년 3차 서울테크노파크-한국로봇융합연구원 로봇ㆍAI 기술컨설팅 지원사업 공고",
    location: "서울",
    period: "2024.11.01 ~ 2024.11.22",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102557",
    deadline: "2024-11-29",
    title:
      "[전북] 2024년 4분기 시험분석 및 품질인증획득지원 참여기업 모집 공고(소기업 혁신역량 강화사업)",
    location: "전북",
    period: "2024.11.01 ~ 2024.11.29",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102575",
    deadline: "2024-11-15",
    title:
      "[경기] 화성시 2024년 인증 지역서점 활성화 프로그램 지원 사업 참여자 모집 공고",
    location: "경기",
    period: "2024.11.01 ~ 2024.11.15",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102087",
    deadline: "2024-11-29",
    title: "양주시 2023년 스마트공장 보급ㆍ확산사업 참여기업 지원금 신청 공고",
    location: "경기",
    period: "2024.10.11 ~ 2024.11.29",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102438",
    deadline: "2024-12-31",
    title: "2024년 9차 중소기업 정책자금 융자계획 변경 공고",
    location: "중소벤처기업부",
    period: "2024.10.28 ~ 2024.12.31",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000092578",
    deadline: "2026-12-31",
    title: "영세개인사업자의 체납액 징수특례 제도 안내",
    location: "국세청",
    period: "2020.01.01 ~ 2026.12.31",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000084853",
    deadline: "2025-09-05",
    title: "소상공인 정책자금(직접대출) 3차 만기연장 지원 안내",
    location: "중소벤처기업부",
    period: "2023.03.06 ~ 2025.09.05",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102115",
    deadline: "2024-10-31",
    title: "암모니아 벙커링 규제자유특구 사업 참여희망 특구사업자 모집 공고",
    location: "울산",
    period: "2024.10.14 ~ 2024.10.31",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102054",
    deadline: "2024-10-23",
    title: "2024년 ICT 청년 창업 코칭 아카데미 공고",
    location: "서울",
    period: "2024.10.16 ~ 2024.10.23",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102112",
    deadline: "2024-11-01",
    title: "2025년 대구산업대상 시상 공고",
    location: "대구",
    period: "2024.10.14 ~ 2024.11.01",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102034",
    deadline: "2024-10-23",
    title: "CES2025 스타트업파크 참관단 모집 공고",
    location: "인천",
    period: "2024.10.10 ~ 2024.10.23",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000101813",
    deadline: "2024-12-13",
    title: "2024년 온라인 채용관 참가기업 추가 모집 공고",
    location: "인천",
    period: "2024.09.30 ~ 2024.12.13",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000093255",
    deadline: "2024-11-27",
    title: "광주시 2024년 동반성장 협력사업 추진 계획 공고",
    location: "경기",
    period: "2023.11.28 ~ 2024.11.27",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102059",
    deadline: "2024-11-29",
    title: "2024년 스마트공장 컨설팅 사업 수혜기업 모집 공고",
    location: "경남",
    period: "2024.10.14 ~ 2024.11.29",
  },
  {
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000100899",
    deadline: "2024-11-29",
    title: "2024년 티몬ㆍ위메프 등 정산지연 피해기업 지원 공고",
    location: "대전",
    period: "2024.08.28 ~ 2024.11.29",
  },
];
async function addCards(cards) {
  for (const card of cards) {
    // 중복 확인
    const existingCard = await Card.findOne({ url: card.url });
    if (!existingCard) {
      // 중복이 없으면 카드 추가
      const newCard = new Card(card);
      await newCard.save();
      console.log(`카드 추가됨: ${card.title}`);
    } else {
      console.log(`중복된 카드 존재: ${card.title}`);
    }
  }
}

// 카드 추가 함수 호출
addCards(cards).catch(console.error);

app.get("/api/cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cards" });
  }
});

// Express 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS 환경에서만 쿠키 전송
      httpOnly: true, // 자바스크립트에서 접근 불가
      maxAge: 24 * 60 * 60 * 1000, // 쿠키의 만료시간 설정 (24시간)
    },
  })
);

let comments = []; // 댓글을 저장하는 간단한 배열 (데이터베이스를 사용할 수도 있음)

// 댓글 저장을 위한 POST 라우트
app.post("/save-comment", (req, res) => {
  const newComment = req.body.comment; // 클라이언트에서 보낸 댓글 내용
  if (newComment) {
    comments.push(newComment); // 댓글 저장
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// 댓글을 불러오기 위한 GET 라우트
app.get("/get-comments", (req, res) => {
  res.json(comments); // 저장된 모든 댓글을 클라이언트에 보냄
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "public")));

// 로그인 페이지 렌더링
app.get("/login", (req, res) => {
  const error = req.session.error;
  req.session.error = null; // 메시지 표시 후 초기화

  res.send(`
<!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>로그인</title>
      <style>
        body {
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Arial, sans-serif;
          background: linear-gradient(45deg, #a47dff, #82dae6);
          background-size: cover;
        }

        .container {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
        }

        h1 {
          text-align: center;
          color: #5e89df;
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #8a73df;
        }

        input[type="text"],
        input[type="password"] {
          width: calc(100% - 22px);
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-sizing: border-box;
          font-size: 14px;
        }

        button {
          width: 100%;
          padding: 10px;
          background-color: #5e89df;
          border: none;
          border-radius: 5px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #8a73df;
        }

        a {
          display: block;
          text-align: center;
          margin-top: 20px;
          color: #5e89df;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        p {
          color: red;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>로그인</h1>
        ${error ? `<p>${error}</p>` : ""}
        <form method="post" action="/login">
          <label for="id">아이디:</label>
          <input type="text" name="id" id="id" required><br>
          <label for="pw">비밀번호:</label>
          <input type="password" name="pw" id="pw" required><br>
          <button type="submit">로그인</button>
        </form>
        <a href="/signup">회원가입</a>
      </div>
    </body>
    </html>

  `);
});

// 로그인 처리
app.post("/login", async (req, res) => {
  const { id, pw } = req.body;

  try {
    const user = await User.findOne({ username: id });
    if (user && (await bcrypt.compare(pw, user.password))) {
      req.session.loggedIn = true;
      req.session.username = id;
      console.log("Login successful, setting session.loggedIn to true");

      // 세션 저장 후 리다이렉트
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          req.session.error = "세션 저장 실패. 다시 시도해주세요.";
          return res.redirect("/login");
        }
        console.log("Session saved successfully, redirecting to /main");
        return res.redirect("/main");
      });
    } else {
      console.log("Invalid credentials");
      req.session.error = "아이디나 비밀번호가 잘못되었습니다.";
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Login error:", error);
    req.session.error = "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
    return res.redirect("/login");
  }
});

// 회원가입 페이지 렌더링
app.get("/signup", (req, res) => {
  const error = req.session.error;
  req.session.error = null; // 메시지 표시 후 초기화

  res.send(`
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>회원가입</title>
    <style>
      body {
        margin: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Arial, sans-serif;
        background: linear-gradient(45deg, #a47dff, #82dae6);
        background-size: cover;
      }

      .container {
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 100%;
      }

      h1 {
        text-align: center;
        color: #5e89df;
        margin-bottom: 20px;
      }

      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #8a73df;
      }

      input[type="text"],
      input[type="password"] {
        width: calc(100% - 22px);
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-sizing: border-box;
        font-size: 14px;
      }

      button {
        width: 100%;
        padding: 10px;
        background-color: #5e89df;
        border: none;
        border-radius: 5px;
        color: white;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      button:hover {
        background-color: #8a73df;
      }

      a {
        display: block;
        text-align: center;
        margin-top: 20px;
        color: #5e89df;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      p {
        color: red;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>회원가입</h1>
      ${error ? `<p>${error}</p>` : ""}
      <form method="post" action="/signup">
        <label for="signup-username">아이디:</label>
        <input type="text" name="signup-username" id="signup-username" required /><br />
        <label for="signup-password">비밀번호:</label>
        <input type="password" name="signup-password" id="signup-password" required /><br />
        <label for="signup-confirm-password">비밀번호 확인:</label>
        <input type="password" name="signup-confirm-password" id="signup-confirm-password" required /><br />
        <button type="submit">회원가입</button>
      </form>
      <a href="/login">로그인</a>
    </div>
  </body>
</html>


  `);
});

// 회원가입 처리
app.post("/signup", async (req, res) => {
  const {
    "signup-username": signupUsername,
    "signup-password": signupPassword,
    "signup-confirm-password": signupConfirmPassword,
  } = req.body;

  if (signupPassword !== signupConfirmPassword) {
    req.session.error = "비밀번호가 일치하지 않습니다.";
    return res.redirect("/signup");
  }

  try {
    // 아이디 중복 검사
    const existingUser = await User.findOne({ username: signupUsername });
    if (existingUser) {
      req.session.error = "이미 사용중인 아이디 입니다.";
      return res.redirect("/signup");
    }

    // 비밀번호 해싱 및 사용자 저장
    const hashedPassword = await bcrypt.hash(signupPassword, 10);
    const newUser = new User({
      username: signupUsername,
      password: hashedPassword,
    });
    await newUser.save();
    req.session.success = "회원가입이 완료되었습니다.";
    return res.redirect("/login");
  } catch (error) {
    console.error("Signup error:", error);
    req.session.error = "회원가입이 완료되지 않았습니다.";
    return res.redirect("/signup");
  }
});

// 메인 페이지 렌더링

app.get("/main", (req, res) => {
  const username = req.session.username || null;
  const isLoggedIn = req.session.loggedIn || false;

  res.send(`
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>메인 페이지</title>
  <link rel="stylesheet" href="/style.css" />
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    
</head>
</head>
<body>
<style>
.alarm-icon {
    position: relative;
    font-size: 24px;
    color: #ffffff;
    cursor: pointer;
  }

  .alarm-icon i {
    font-size: 30px; /* 종 아이콘 크기 설정 */
    color: #ffffff;  /* 종 아이콘 기본 색상 */
  }

  .alarm-count {
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: red;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    display: none; /* 초기 상태는 숨김 */
  }

.alarm-box {
    position: absolute;
    top: 90px; /* 종 아이콘에서 더 아래로 내려오게 조정 */
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 350px; /* 알람 박스 너비 확장 */
    max-height: 400px; /* 높이 조정 */
    overflow-y: auto; /* 스크롤 가능 */
    z-index: 1000;
    padding: 20px; /* 박스 안쪽 여백 추가 */
  }

  .alarm-box ul {
    list-style-type: none;
    padding: 10px;
    margin: 0;
  }

  .alarm-box ul li {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  .alarm-box ul li:last-child {
    border-bottom: none;
  }
    </style>
  <nav class="nav">
    <div class="container">
      <div class="logo">
        <a href="#">CATCH</a>
        ${
          isLoggedIn
            ? `<div class="welcome-message">
                환영합니다, ${username}님!
              </div>`
            : ``
        }
      </div>
      <div id="mainListDiv" class="main_list">
        <ul>
          <li><a href="/main">메인</a></li>
            ${isLoggedIn ? `<li><a href="/1.html">지원사업</a></li>` : ``}

          <li><a href="/cm">커뮤니티</a></li>
          ${isLoggedIn ? `<li><a href="/mypage">마이페이지</a></li>` : ``}
          
          <div class="auth-container">
            ${
              isLoggedIn
                ? `
              <button class="button" onclick="window.location.href='/logout'">
                로그아웃
                <div class="fill-one"></div>
              </button>
            `
                : `
              <button class="button" onclick="window.location.href='/login'">
                로그인
                <div class="fill-one"></div>
              </button>
            `
            }
          </div>
     
        </ul>
      </div>
    </div>
  </nav>

    </div>
  </div>
  <!-- 메인 글씨 -->
  <div style="position: relative; top: 300px; margin: 0 auto; width: 1250px;" class="fade-in">
    <h1><b><span style="margin-top:20px; font-size:50px; vertical-align: bottom; text-align: center; padding-right:50%;">지원사업을 한 눈에</span></b></h1>
    <h2>
      <span style="display: block; margin-top: 0px; font-size: 20px; opacity: 0.5;">
        전국민 대상으로 여러 지원사업을 볼 수 있습니다.
        <br>
        <a style="display: inline-block; margin-top: 0.5%;">커뮤니티에서 다양한 사람들과 대화를 해보세요.</a>
      </span>
    </h2>
    <div style="width: auto; margin: 0 auto;">
      <img src="main.png" style="position: absolute; top: -10%; margin-left: 55%; width: 50%;" />
    </div>
  </div>

  <!-- 슬라이더 -->
  <link rel="stylesheet" href="slide.css">
   
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">

  <div class="slider">
    <button id="prev" class="btn">
      <i class="las la-angle-left"></i>
    </button>
    <div class="card-content">
      <!-- 카드 0 -->
      <div class="card">
        <i class="lar la-heart"></i>
        <div class="card-img" alt="Image">
          <a href="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C161/AW/114/view.do?article_seq=81663" target="_blank">
            <img src="0.jpg">
          </a>
        </div>
      </div>
      <!-- 카드 1 -->
      <div class="card">
        <i class="lar la-heart"></i>
        <div class="card-img">
          <a href="https://xn--ob0bkuxdz53d0ve18ay3t1nat2c90bx9irt6a.kr/eng/man/SMAN010M/page.do" target="_blank">
            <img src="1.png">
          </a>
        </div>
      </div>
      <!-- 카드 2 -->
      <div class="card">
        <i class="lar la-heart"></i>
        <div class="card-img">
          <a href="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000094391" target="_blank">
            <img src="2.png" alt="Image">
          </a>
        </div>
      </div>
      <!-- 카드 3 -->
      <div class="card">
        <i class="lar la-heart"></i>
        <div class="card-img">
          <a href="https://www.sbiz24.kr/#/cmmn/gnrl/bbs/4/478" target="_blank">
            <img src="3.png" alt="Image">
          </a>
        </div>
      </div>
      <!-- 카드 4 -->
      <div class="card">
        <i class="lar la-heart"></i>
        <div class="card-img">
          <a href="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C130/AY/115/view.do?article_seq=82049" target="_blank">
            <img src="4.png" alt="Image">
          </a>
        </div>
      </div>
      <!-- 카드 5 -->
      <div class="card">
        <i class="lar la-heart"></i>
        <div class="card-img">
          <a href="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000100876" target="_blank">
            <img src="5.png" alt="Image">
          </a>
        </div>
      </div>
      <!-- Card End -->
    </div>
    <button id="next" class="btn">
      <i class="las la-angle-right"></i>
    </button>
  </div>
  <script src="slide.js" defer></script>

  

  <!-- 공지사항 -->
  <div class="notice-box">
    <div class="notice-title">공지사항</div>
    <ul class="notice-list">
      <li class="notice-item">
        <a href="an.html">지원사업 신청 페이지 오픈 안내</a>
        <div class="notice-date">2024년 9월 4일</div>
      </li>
      <li class="notice-item">
        <a href="an2.html">지원사업 신청 절차 안내</a>
        <div class="notice-date">2024년 9월 4일</div>
      </li>
      <li class="notice-item">
        <a href="an3.html">기타 문의 및 지원</a>
        <div class="notice-date">2024년 9월 4일</div>
      </li>
    </ul>
  </div>




<script>

<script>
    document.getElementById('supportLink').addEventListener('click', function(event) {
        const isLoggedIn = ${isLoggedIn}; // 서버에서 설정된 로그인 상태를 확인

        if (!isLoggedIn) {
            event.preventDefault(); // 기본 링크 동작 방지
            alert('로그인 후 이용 가능합니다.'); // 로그인 안내 메시지
            window.location.href = '/main'; // 메인 페이지로 리다이렉트
        }
    });

    function logout() {
        window.location.href = '/logout'; // 로그아웃 페이지로 이동
    }
    </script>

  <!-- 푸터 -->
  <footer>
    <div class="background">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
      >
        <defs>
          <linearGradient id="bg" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color: rgba(138, 115, 223, 0.6)"></stop>
            <stop offset="100%" style="stop-color: rgba(94, 137, 223, 0.06)"></stop>
          </linearGradient>
          <path
            id="wave"
            fill="url(#bg)"
            d="M-363.852,502.589c0,0,236.988-41.997,505.475,0 s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
          />
        </defs>
        <g>
          <use xlink:href="#wave" opacity=".3">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="8s"
              calcMode="spline"
              values="270 230; -334 180; 270 230"
              keyTimes="0; .5; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite"
            />
          </use>
          <use xlink:href="#wave" opacity=".6">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="6s"
              calcMode="spline"
              values="-270 230;243 220;-270 230"
              keyTimes="0; .6; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite"
            />
          </use>
          <use xlink:href="#wave" opacity=".9">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="4s"
              calcMode="spline"
              values="0 230;-140 200;0 230"
              keyTimes="0; .4; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite"
            />
          </use>
        </g>
      </svg>
    </div>

    <section>
      <ul class="links">
        <li style="margin-top: 300px;"><a>회사정보<p>캐치</p></a></li>
        <li style="margin-top: 300px;"><a>대표 <p>안서희 이선미</p></a></li>
        <li style="margin-top: 300px;"><a>주소 <p>서울시 성동구 살곶이길 200</p></a></li>
        <li style="margin-top: 300px;"><a>고객센터 <p>E-mail.catch2122@kall.com | Tel.02-123-4567</p></a></li>
      </ul>
      <p class="legal" style="font-size: 15px; margin-top: 100px;">FAQ | 개인정보처리방침 | 이용약관 |</p>
    </section>
  </footer>
  <script src="alar.js" defer></script>
</body>
</html>
  `);
});
//지원사업 페이지
app.get("/sp", (req, res) => {
  const username = req.session.username || null;
  const isLoggedIn = req.session.loggedIn || false;

  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>지원사업</title>
      <link rel="stylesheet" href="/style.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
    <script src="slide.js" defer></script>
     <script src="serach.js" defer></script>
</head>
<body>

    <style>
        :root {
    --menu-width: 37.5em; /* Width of menu */
    --items: 4; /* Number of items you have */
    --item-width: calc(var(--menu-width) / var(--items));
}

body {
    margin: 0;
    padding: 0;
    background: linear-gradient(45deg, #a47dff, #82dae6);
    font-family: 'Roboto', sans-serif;
 

}

@import url('https://fonts.googleapis.com/css?family=Quicksand:400,500,700');
html,
body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Quicksand", sans-serif;
    font-size: 62.5%;
    font-size: 10px;
    overflow-x: hidden;
    height: 100%;
}
/*-- Inspiration taken from abdo steif -->
/* --> https://codepen.io/abdosteif/pen/bRoyMb?editors=1100*/

/* 메뉴바 */
.nav {
    width: 98%;
    height: 65px;
    position: fixed;
    line-height: 65px;
    text-align: center;
    z-index: 2;
    
}

.nav div.logo {
    float: left;
    width: auto;
    height: auto;
    padding-left: 3rem;
}

.nav div.logo a {
    text-decoration: none;
    color: #fff;
    font-size: 2.5rem;
}


.nav div.main_list {
    height: 65px;
    float: right;
}

.nav div.main_list ul {
    width: 100%;
    height: 65px;
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

.nav div.main_list ul li {
    width: auto;
    height: 65px;
    padding: 0;
    padding-right: 3rem;
}

.nav div.main_list ul li a {
    text-decoration: none;
    color: #fff;
    line-height: 65px;
    font-size: 2.4rem;
     padding: 10px;
}

.nav div.main_list ul li a:hover {
    color: #a47dff;
}


.navTrigger {
    display: none;
}

.nav {
    padding-top: 20px;
    padding-bottom: 20px;
    -webkit-transition: all 0.4s ease;
    transition: all 0.4s ease;
}


/* 버튼 */
.btn {
  border: none;
  display: block;
  text-align: center;
  cursor: pointer;
  text-transform: uppercase;
  outline: none;
  overflow: hidden;
  position: relative;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  background-color: #222;
  padding: 17px 60px;
  margin: 0 auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.20);
  margin-top: 10px;
}

.btn span {
  position: relative; 
  z-index: 1;
}

.btn:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 490%;
  width: 140%;
  background: #78c7d2;
  -webkit-transition: all .5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-transform: translateX(-98%) translateY(-25%) rotate(45deg);
  transform: translateX(-98%) translateY(-25%) rotate(45deg);
}

.btn:hover:after {
  -webkit-transform: translateX(-9%) translateY(-25%) rotate(45deg);
  transform: translateX(-9%) translateY(-25%) rotate(45deg);
}

.background {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}


svg {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleY(3.7) scaleX(5);
  transform-origin: bottom;
  box-sizing: border-box;
  display: block;
  pointer-events: none;
}

footer {
  left: 0;
  bottom: 0;
  display: flex;
  width: 100%;
  position: relative;
 margin-top: 5%;
}


section {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 30px;
  padding-bottom: 80px;
  padding-left: 60px;
  width: 100%;
}

@media (width > 420px) {
  section {
    align-items: center;
    padding-left: 0;
    gap: 20px;
  }

  .links {
    gap: 20px;
    font-size: 15px;
   
  }
}

.button {
	font-family: Helvetica, sans-serif;
	font-weight: 100;
	color: #fff;
}



.container {
	text-align: center;
	position: relative;
	margin: 0 auto;
	cursor: pointer;
}

.button {
	position: relative;
	height: 50px;
	width: 150px;
	border: 0;
	border-radius: 5px;
	text-transform: uppercase;
	font-size: 1.9em;
	letter-spacing: 0.2em;
	overflow: hidden;
	box-shadow: 0 4px 12px 0 rgba(152, 160, 180, 10);
	z-index: 0;
}



.fill-one {
	position: absolute;
	background-image: linear-gradient(to right, #a47dff, #82dae6);
	height: 70px;
	width: 420px;
	border-radius: 5px;
	margin: -40px 0 0 -140px;
	z-index: -1;
	transition: all 0.4s ease;
}

.container-one:hover .fill-one {
	-webkit-transform: translateX(100px);
	-moz-transform: translateX(100px);
	transform: translateX(100px);
}

.favorite-btn {
    background-color: #ff6b6b; /* 찜하기 버튼의 색상 */
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
}

.favorite-btn:hover {
    background-color: #ff5252; /* 호버 시 색상 */
}

/* 검색 */

#search {
    width: 300px; /* 원하는 너비로 조정 */
    padding: 10px 15px; /* 안쪽 여백 */
    border: none; /* 기본 테두리 제거 */
    border-bottom: 2px solid #ccc; /* 기본 밑부분 테두리 색상 및 두께 */
    border-radius: 0; /* 모서리 둥글기 제거 */
    font-size: 16px; /* 글자 크기 */
    outline: none; /* 포커스 시 기본 테두리 제거 */
    box-shadow: none; /* 그림자 효과 제거 */
    transition: border-color 0.3s, box-shadow 0.3s; /* 테두리 및 그림자 효과 부드러운 전환 */
    margin-left: auto; /* 가운데 정렬 */
    margin-right: auto; /* 가운데 정렬 */
    display: block; /* 블록 요소로 변경 */
    position: relative;
    left: 48%; /* 수평 중앙 정렬 */
    transform: translateX(-50%); /* 수평 중앙 정렬 보정 */
    top: 150px; /* 위쪽 여백 */
    box-shadow: 3px 3px 5px 5px #1060a561;
    border-radius: 10px;
}

#search::placeholder {
    color: #888; /* 플레이스홀더 색상 */
    font-style: italic; /* 플레이스홀더 이탤릭체 */

}

#search:focus {
    border: none; /* 포커스 시 전체 테두리 제거 */
    border-bottom: 2px solid #007bff; /* 포커스 시 밑부분 테두리 색상 변경 */
    box-shadow: none; /* 포커스 시 그림자 제거 */
    
}

.auth-container {
  display: flex;
  flex-direction: column; /* 요소들을 수직으로 나열 */
  align-items: flex-start; /* 왼쪽 정렬 */
}


</style>

<!-- html -->
<nav class="nav">
    <div class="container">
      <div class="logo">
        <a href="#">CATCH </a>
        ${
          isLoggedIn
            ? `<div class="welcome-message">
        환영합니다, ${username}님!</div>`
            : ``
        }
          
      </div>
      <div id="mainListDiv" class="main_list">
        <ul>
          <li><a href="/main">메인</a></li>
        ${isLoggedIn ? `<li><a href="/1.html">지원사업</a></li>` : ``}
          <li><a href="/cm">커뮤니티</a></li>
          ${isLoggedIn ? `<li><a href="/mypage">마이페이지</a></li>` : ``}
  ${
    isLoggedIn
      ? `
            <li>
    <!-- 종 모양 알람 아이콘 -->
    <div class="alarm-icon"id="alarmicon" onclick="toggleAlarmBox()" >
        <i class="fas fa-bell"></i>
        <div class="alarm-count" id="alarmCount" style="display: none;">0</div>
    </div>
    <!-- 알림 리스트가 뜨는 박스 -->
    <div class="alarm-box" id="alarmBox" style="display: none;">
        <ul id="alarmList">
        </ul>
    </div>
</li>

        `
      : ``
  }
          <div class="auth-container">
            ${
              isLoggedIn
                ? `
              <button class="button" onclick="window.location.href='/logout'">
                로그아웃
                <div class="fill-one"></div>
              </button>
            `
                : `
              <button class="button" onclick="window.location.href='/login'">
                로그인
                <div class="fill-one"></div>
              </button>
            `
            }
          </div>
        </ul>
      </div>
    </div>
  </nav>
    
<!-- Jquery needed -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="js/scripts.js"></script>
    


    </style>
   
    
    <script src="https://kit.fontawesome.com/628c8d2499.js" crossorigin="anonymous"></script>

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css" type="text/css" />
      <link rel="stylesheet" href="alarm2.css">
     <P></P>
    
     <!-- 맨위글씨 -->
    <div style="position: relative; top: 300px;margin:0 auto;width: 1250px;">
        <h1><b><span style="margin-top:20px;font-size:60px; vertical-align: bottom; text-align: center;margin-left: 9%; font-family: 'KBO-Dia-Gothic_bold';" >지금 바로 지원사업을 보고 신청해보세요!</span></b></h1>
        <p></p>
    </span>
</h2>


<!-- 검색 -->
<input type="text" id="search" placeholder="검색어를 입력하세요" onkeyup="searchCards()" style="margin-left: 39%;">
<body class="${isLoggedIn ? "logged-in" : ""}">
<!-- 지원사업 카드 -->
 <div class="wrapper"> 
 <link rel="stylesheet" href="card.css" type="text/css" />   
 
   <!-- 1 -->
    <div class="cards">
        <div class="row">
<div class="card" 
     data-url="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102087" 
     data-deadline="2024-11-29" 
     title="양주시 2023년 스마트공장 보급ㆍ확산사업 참여기업 지원금 신청 공고">
    <button class="wishlist-btn" onclick="addToWishlist(event)">
        &#x2764; <!-- 유니코드 하트 -->
    </button>
    <br>[경기]<br>양주시 2023년 스마트공장<br>보급ㆍ확산사업 참여기업 지원금 <br>신청 공고<br><br><br><br><hr>
    기간 : 2024.10.11 ~ 2024.11.29 
    <span class="warning-icon" style="display: none;">❗</span>
</div>



    <div class="card" 
     data-url="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102438" 
     data-deadline="2024-12-31" 
     title="
2024년 9차 중소기업 정책자금 융자계획 변경 공고">
    <button class="wishlist-btn" onclick="addToWishlist(event)">
        &#x2764; <!-- 유니코드 하트 -->
    </button>
    <br>[중소벤처기업부]<br>
2024년 9차 중소기업 정책자금 융자계획 변경 공고<br><br><br><br><br><hr>
    기간 : 2024.10.28 ~ 2024.12.31
    <span class="warning-icon" style="display: none;">❗</span>
</div>

<div class="card" 
     data-url="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000092578" 
     data-deadline="2026-12-31" 
     title="영세개인사업자의 체납액 징수특례 제도 안내">
    <button class="wishlist-btn" onclick="addToWishlist(event)">
        &#x2764; <!-- 유니코드 하트 -->
    </button>
    <br>[국세청]<br>영세개인사업자의 체납액 징수특례 제도 안내<br><br><br><br><br><hr>
    기간 : 2020.01.01 ~ 2026.12.31
    <span class="warning-icon" style="display: none;">❗</span>
</div>

     
    <!-- 2 -->
   <div class="row">      
    <div class="card" 
         data-url="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000084853" 
         data-deadline="2025-09-05" 
         title="소상공인 정책자금(직접대출) 3차 만기연장 지원 안내">
        <button class="wishlist-btn" onclick="addToWishlist(event)">
            &#x2764; <!-- 유니코드 하트 -->
        </button>
        <br>[중소벤처기업부]<br>소상공인 정책자금(직접대출) 3차 만기연장 지원 안내<br><br><br><br><br><hr>
        기간 : 2023.03.06 ~ 2025.09.05 
        <span class="warning-icon" style="display: none;">❗</span>
    </div>
        
    <div class="card" 
         data-url="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102115" 
         data-deadline="2024-10-31" 
         title="암모니아 벙커링 규제자유특구 사업 참여희망 특구사업자 모집 공고">
        <button class="wishlist-btn" onclick="addToWishlist(event)">
            &#x2764; <!-- 유니코드 하트 -->
        </button>
        <br>[울산]<br>암모니아 벙커링 규제자유특구 사업<br> 참여희망 특구사업자 모집 공고<br><br><br><br><br><hr>
        기간 : 2024.10.14 ~ 2024.10.31
        <span class="warning-icon" style="display: none;">❗</span>
    </div>

    <div class="card" 
         data-url="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102054" 
         data-deadline="2024-10-23" 
         title="2024년 ICT 청년 창업 코칭 아카데미 공고">
        <button class="wishlist-btn" onclick="addToWishlist(event)">
            &#x2764; <!-- 유니코드 하트 -->
        </button>
        <br>[서울]<br>2024년 ICT 청년 창업 코칭<br> 아카데미 공고<br><br><br><br><br><hr>
        기간 : 2024.10.16 ~ 2024.10.23
        <span class="warning-icon" style="display: none;">❗</span>
    </div>
</div>


        <!-- 3 -->
        <div class="row">

    <div class="card" 
         data-url="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102112" 
         data-deadline="2024-11-01" 
         title="2025년 대구산업대상 시상 공고">
        <button class="wishlist-btn" onclick="addToWishlist(event)">
            &#x2764; <!-- 유니코드 하트 -->
        </button>
        <br>[대구]<br>2025년 대구산업대상 시상 공고<br><br><br><br><br><br><hr>
        기간 : 2024.10.14 ~ 2024.11.01
        <span class="warning-icon" style="display: none;">❗</span>
    </div>

    <div class="card" 
         data-url="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102034" 
         data-deadline="2024-10-23" 
         title="CES2025 스타트업파크 참관단 모집 공고">
        <button class="wishlist-btn" onclick="addToWishlist(event)">
            &#x2764; <!-- 유니코드 하트 -->
        </button>
        <br>[인천]<br>CES2025 스타트업파크 참관단 <br>모집 공고<br><br><br><br><br><hr>
        기간 : 2024.10.10 ~ 2024.10.23 
        <span class="warning-icon" style="display: none;">❗</span>
    </div>
          
    <div class="card" 
         data-url="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000101813" 
         data-deadline="2024-12-13" 
         title="2024년 온라인 채용관 참가기업 추가 모집 공고">
        <button class="wishlist-btn" onclick="addToWishlist(event)">
            &#x2764; <!-- 유니코드 하트 -->
        </button>
        <br>[인천]<br>2024년 온라인 채용관 참가기업<br> 추가 모집 공고<br><br><br><br><br><hr>
        기간 : 2024.09.30 ~ 2024.12.13
        <span class="warning-icon" style="display: none;">❗</span>
    </div>      

</div>

         
        <!-- 4 -->
       <div class="row">

    <div class="card" 
         data-url="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000093255" 
         data-deadline="2024-11-27" 
         title="광주시 2024년 동반성장 협력사업 추진 계획 공고">
        <button class="wishlist-btn" onclick="addToWishlist(event)">
            &#x2764; <!-- 유니코드 하트 -->
        </button>
        <br>[경기]<br>광주시 2024년 동반성장 협력사업<br>추진 계획 공고<br><br><br><br><br><hr>
        기간 : 2023.11.28 ~ 2024.11.27 
        <span class="warning-icon" style="display: none;">❗</span>
    </div> 

    <div class="card" 
         data-url="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000102059" 
         data-deadline="2024-11-29" 
         title="2024년 스마트공장 컨설팅 사업 수혜기업 모집 공고">
        <button class="wishlist-btn" onclick="addToWishlist(event)">
            &#x2764; <!-- 유니코드 하트 -->
        </button>
        <br>[경남]<br>2024년 스마트공장 컨설팅 사업 <br>수혜기업 모집 공고<br><br><br><br><br><hr>
        기간 : 2024.10.14 ~ 2024.11.29
        <span class="warning-icon" style="display: none;">❗</span>
    </div>     

    <div class="card" 
         data-url="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000100899" 
         data-deadline="2024-11-29" 
         title="2024년 티몬ㆍ위메프 등 정산지연 피해기업 지원 공고">
        <button class="wishlist-btn" onclick="addToWishlist(event)">
            &#x2764; <!-- 유니코드 하트 -->
        </button>
        <br>[대전]<br>2024년 티몬ㆍ위메프 등<br>정산지연 피해기업 지원을 위한<br>중소기업 긴급경영안정자금 지원 공고<br><br><br><br><hr>
        기간 : 2024.08.28 ~ 2024.11.29
        <span class="warning-icon" style="display: none;">❗</span>
    </div>     

</div>

            
        </div>
    </div>
    <div class="pagination" style="display: flex; justify-content: space-between; align-items: center; ">
      <button id="prev" style="font-family: 'KBO-Dia-Gothic_bold';">이전</button>
      <span id="page-number" style="flex-grow: 1; text-align: center; font-size: 20px; font-family: 'KBO-Dia-Gothic_bold';"></span>
      <button id="next" style="font-family: 'KBO-Dia-Gothic_bold';">다음</button>
  </div>
</div>



// 로그인 상태 확인 함수





</script>
<script src="al.js"></script>
<script src="card.js"></script>
<script src="link.js"></script>
<script src="zzim.js"></script>
<script src="alarm.js"></script>
<script src="cleanup.js"></script>
</body>

<!-- 푸터 -->
 <footer>
    <div class="background">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
      >
        <defs>
          <linearGradient id="bg" x2="0%" y2="100%">
            <stop
              offset="0%"
              style="stop-color: rgba(138, 115, 223, 0.6)"
            ></stop>
            <stop
              offset="100%"
              style="stop-color: rgba(94, 137, 223, 0.06)"
            ></stop>
          </linearGradient>
          <path
            id="wave"
            fill="url(#bg)"
            d="M-363.852,502.589c0,0,236.988-41.997,505.475,0
    s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
          />
        </defs>
        <g>
          <use xlink:href="#wave" opacity=".3">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="8s"
              calcMode="spline"
              values="270 230; -334 180; 270 230"
              keyTimes="0; .5; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite"
            />
          </use>
          <use xlink:href="#wave" opacity=".6">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="6s"
              calcMode="spline"
              values="-270 230;243 220;-270 230"
              keyTimes="0; .6; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite"
            />
          </use>
          <use xlink:href="#wave" opacty=".9">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="4s"
              calcMode="spline"
              values="0 230;-140 200;0 230"
              keyTimes="0; .4; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite"
            />
          </use>
        </g>
      </svg>
    </div>

    <section>
   
        <!-- 푸터글씨 -->
      <ul class="links">
        <li style="margin-top: 300px;"><a>회사정보<p>캐치</p></a></li>
        <li style="margin-top: 300px;"><a>대표 <p>안서희 이선미</p></a></li>
        <li style="margin-top: 300px;"><a>주소 <p>서울시 성동구 살곶이길 200</p></a></li>
        <li style="margin-top: 300px;"><a>고객센터 <p>E-mail.catch2122@kall.com | Tel.02-123-4567</p></a></li>
  
      </ul>
      <p class="legal" style="font-size: 15px;margin-top: 100px;">FAQ | 개인정보처리방침 | 이용약관 |</p>
    </section>
  </footer>


</body>
</html>
  `);
});

//마이 페이지 렌더링

app.get("/mypage", (req, res) => {
  const username = req.session.username || null;
  const isLoggedIn = req.session.loggedIn || false;

  res.send(`
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>마이페이지</title>
    <style>
    body {
    display: flex; /* Flexbox 사용 */
    flex-direction: column; /* 세로 방향으로 정렬 */
    align-items: center; /* 수평 중앙 정렬 */
    justify-content: flex-start; /* 세로 방향은 시작 부분에서 정렬 */
    margin: 0; 
    padding: 0;
    background-color: #fff;
    font-family: Arial, sans-serif;
    padding-bottom: 200px;
    max-width: 10000px; /* 최대 폭을 설정합니다. */
    overflow-x: hidden;
}


#wishlist-container {
    position: relative; /* 카드가 이 컨테이너를 기준으로 배치됩니다. */
    height: 700px; /* 컨테이너의 높이를 설정하여 카드가 이 안에서 위치를 유지하도록 합니다. */
    margin-top: 20px; /* 상단 여백을 추가하여 여유 공간을 둡니다. */
}

        /* 그라데이션 배경 설정 */
        .header {
            height: 300px;
            background: linear-gradient(45deg, #a47dff, #82dae6);
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 2.5rem;
            font-weight: bold;
            width: 100%;
        }

        /* 카드 스타일 */
        .card {
            border: 1px solid #ccc;
            padding: 20px;
            margin: 15px;
            width: 300px;
            text-align: center;
            background-color: #fff; /* 카드 배경 흰색 */
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 카드 그림자 */
            margin-top: 340px;
            margin-left: -650px;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            font-family: "KBO-Dia-Gothic_bold";
            box-shadow: 5px 5px 10px 10px #1060a561;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            
        }

@font-face {
    font-family: "KBO-Dia-Gothic_bold";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/KBO-Dia-Gothic_bold.woff")
    format("woff");
    font-weight: 700;
    font-style: normal;
}

        /* 카드에 마우스를 올렸을 때 효과 */
        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

    .pagination {
  text-align: center; /* 버튼을 중앙 정렬 */
  margin-top: 700px; /* 버튼을 아래로 내리기 위한 여백 설정 */
/* 버튼 위쪽에 추가 여백을 주어 간격을 조정 */


}

.wishlist-item {
  display: flex;
  flex-direction: column; /* 카드 내용을 세로로 나열 */
  margin-bottom: 15px; /* 카드 간격 조정 */
}
.wishlist-btn {
    position: absolute;
    top: 10px; /* 카드의 위쪽에서 10px 아래에 배치 */
    left: 10px; /* 카드의 왼쪽에서 10px 오른쪽에 배치 */
    background-color: #82dae6; /* 버튼 색상 (Tomato 색) */
    color: white; /* 버튼 텍스트 색상 */
    border: none; /* 기본 테두리 제거 */
    padding: 5px 10px; /* 버튼 안의 여백 */
    border-radius: 5px; /* 버튼 모서리 둥글게 */
    cursor: pointer; /* 커서를 포인터로 변경 */
}

.wishlist-btn:hover {
    background-color: #a47dff; /* 버튼에 마우스 오버 시 색상 변경 */
}

.pagination button {
    padding: 10px 20px; /* 버튼의 패딩을 조정 */
    margin: 0 710px; /* 버튼 간의 여백을 조정 */
    cursor: pointer;
    background-color: #7ca3f8;
    color: #fff;
    border: none;
    border-radius: 5px;
    white-space: nowrap; /* 글자가 한 줄로 표시되도록 설정 */
    overflow: hidden; /* 넘치는 부분을 숨김 */
    text-overflow: ellipsis; /* 넘치는 글자를 줄임표(...)로 표시 */
}



    </style>
</head>
<body>

    <div class="header">
        MY PAGE
    </div>

 

    <script src="mypage.js"></script>
    <script src="notice.js"></script>
   
    

    <div id="wishlist-container"></div>
   
    <div class="pagination" style="display: flex; justify-content: space-between; align-items: center;">
        <button id="prev" style="font-family: 'KBO-Dia-Gothic_bold';">이전</button>
        <span id="page-number" style="flex-grow: 1; text-align: center; font-size: 20px; font-family: 'KBO-Dia-Gothic_bold';"></span>
        <button id="next" style="font-family: 'KBO-Dia-Gothic_bold';">다음</button>
    </div>

    <script>

        document.addEventListener("DOMContentLoaded", function () {
            const cards = document.querySelectorAll(".card");
            const prevButton = document.getElementById("prev");
            const nextButton = document.getElementById("next");
            const pageNumber = document.getElementById("page-number");

            let currentPage = 1;
            const cardsPerPage = 6;

            const positions = [
                { top: "0px", left: "10px" }, // 첫 번째 카드
                { top: "0px", left: "470px" }, // 두 번째 카드
                { top: "0px", left: "930px" }, // 세 번째 카드
                { top: "500px", left: "10px" }, // 네 번째 카드
                { top: "500px", left: "470px" }, // 다섯 번째 카드
                { top: "500px", left: "930px" }, // 여섯 번째 카드
            ];

            showPage(currentPage);

            prevButton.addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage--;
                } else {
                    currentPage = Math.ceil(cards.length / cardsPerPage);
                }
                showPage(currentPage);
            });

            nextButton.addEventListener("click", () => {
                const totalPages = Math.ceil(cards.length / cardsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                } else {
                    currentPage = 1;
                }
                showPage(currentPage);
            });

            function showPage(page) {
                const startIndex = (page - 1) * cardsPerPage;
                const endIndex = startIndex + cardsPerPage;

                cards.forEach((card, index) => {
                    if (index >= startIndex && index < endIndex) {
                        card.style.display = "block"; // 카드를 보이게 함
                        const position = positions[index % cardsPerPage];
                        card.style.position = "absolute";
                        card.style.top = position.top;
                        card.style.left = position.left;
                    } else {
                        card.style.display = "none"; // 카드를 숨김
                    }
                });

                pageNumber.textContent = page;
            }
        });
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const url = this.getAttribute("data-url");
      if (url) {
        window.location.href = url;
      }
          });
  });
})
        
    </script>
                    
</body>
</html>
  `);
});

app.get("/cm", (req, res) => {
  const username = req.session.username || null;
  const isLoggedIn = req.session.loggedIn || false;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>커뮤니티</title>
    </head>
    <body>
   <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css" type="text/css" />
    <nav class="nav">
    <div class="container">
      <div class="logo">
        <a href="#">CATCH</a>
        ${
          isLoggedIn
            ? `<div class="welcome-message">
                환영합니다, ${username}님!
              </div>`
            : ``
        }
      </div>
      <div id="mainListDiv" class="main_list">
        <ul>
          <li><a href="/main">메인</a></li>
           ${isLoggedIn ? `<li><a href="/1.html">지원사업</a></li>` : ``}
          <li><a href="/cm">커뮤니티</a></li>
          ${isLoggedIn ? `<li><a href="/mypage">마이페이지</a></li>` : ``}
          <div class="auth-container">
            ${
              isLoggedIn
                ? `
              <button class="button" onclick="window.location.href='/logout'">
                로그아웃
                <div class="fill-one"></div>
              </button>
            `
                : `
              <button class="button" onclick="window.location.href='/login'">
                로그인
                <div class="fill-one"></div>
              </button>
            `
            }
          </div>
        </ul>
      </div>
    </div>
  </nav>

        <div id="comments-section">
            <h1 id="dat1">소통 공간</h1>
            ${
              isLoggedIn
                ? `
            <form id="comment-form">
                <textarea id="comment-input" placeholder="댓글을 작성하세요..." required></textarea>
                <button type="submit">작성</button>
            </form>
            <div id="comments-list"></div>
            `
                : `
            <p id="dat2">로그인 후 댓글을 작성할 수 있습니다. <a id="dat3" href="/login">로그인</a></p>
            `
            }
        </div>


 <script>
       document.addEventListener("DOMContentLoaded", function() {
  const commentForm = document.getElementById("comment-form");
  const commentInput = document.getElementById("comment-input");
  const commentsList = document.getElementById("comments-list");

  // 서버에서 댓글 불러오는 함수
  function loadComments() {
    fetch('/get-comments')
      .then(response => response.json())
      .then(comments => {
        commentsList.innerHTML = ''; // 댓글 목록 초기화
        comments.forEach(commentText => {
          const comment = document.createElement("div");
          comment.classList.add("comment");
          comment.textContent = \`익명: \${commentText}\`;;
          commentsList.appendChild(comment);
        });
      })
      .catch(err => console.error("Failed to load comments:", err));
  }

  // 댓글 서버에 저장하는 함수
  function saveComment(commentText) {
    fetch('/save-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: commentText }),
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        console.log("댓글이 성공적으로 저장되었습니다.");
      } else {
        console.error("Failed to save comment.");
      }
    })
    .catch(err => console.error("Failed to save comment:", err));
  }

  // 댓글 작성 이벤트 리스너
  if (commentForm) {
    commentForm.addEventListener("submit", function(event) {
      event.preventDefault(); // 폼 제출 기본 동작 방지

      const commentText = commentInput.value.trim();

      // 댓글 내용이 있는 경우
      if (commentText) {
        const comment = document.createElement("div");
        comment.classList.add("comment");
        comment.textContent = \`익명: \${commentText}\`;;
        commentsList.appendChild(comment);

        // 댓글 서버에 저장
        saveComment(commentText);
        commentInput.value = ""; // 입력 필드 초기화
      } else {
        alert("댓글을 작성하세요.");
      }
    });
  }

  // 페이지 로드 시 서버에서 댓글 불러오기
  loadComments();
});

        
    </script>
    
     <link rel="stylesheet" href="/cm.css" />
    </body>
    </html>
  `);
});

// 로그아웃 처리
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/main");
    }
    // 로그아웃 후 메인 페이지로 리다이렉트
    return res.redirect("/main");
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
