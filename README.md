# MoneyEasy - MoneyEasy Financial System

<div align="center">
   <img style="width: 180px; margin-bottom: 10px;" src="https://firebasestorage.googleapis.com/v0/b/exe201-9459a.appspot.com/o/EzMoney%2Flogo_app_splash.png?alt=media&token=bc76a24e-79a3-48f4-af40-d056f65ee88f" />
    <p><a href="https://easymoney.anttravel.online/moneyez-web">MoneyEasy</a> – Simplify personal and group financial management with smart automation and insightful analytics.
</div>

### Welcome to MoneyEasy

### Demo: [MoneyEasy](https://easymoney.anttravel.online/moneyez-web)

#### Introduction

MoneyEasy is a smart, user-friendly solution designed to simplify personal and group finance management. From tracking income and expenses to following structured budgeting models like 6 JARs, 50-30-20, or 80-20, MoneyEasy automates the hard parts of financial planning so you can focus on your goals. Say goodbye to messy spreadsheets and manual calculations—MoneyEasy connects to your bank, visualizes your financial data through clear reports and charts, and sends helpful alerts to keep your spending on track. Whether you're saving for the future, managing group expenses, or planning investments, MoneyEasy makes financial control effortless.

## 📌 Features

### 👤 Account Management

| ID  | Use Case          | Actors      | Description                             |
| --- | ----------------- | ----------- | --------------------------------------- |
| 01  | View profile      | User, Admin | View personal account details.          |
| 02  | Edit profile      | User        | Update personal information.            |
| 03  | Login             | User, Admin | Log into the system.                    |
| 04  | Forgot password   | User, Admin | Reset password via email or token.      |
| 05  | Create account    | Admin       | Admin creates a new admin account.      |
| 06  | Register account  | Guest       | Guest creates a user account.           |
| 07  | Delete account    | Admin       | Admin deletes a user account.           |
| 08  | Update account    | Admin       | Admin updates user account information. |
| 09  | View list account | Admin       | View all registered accounts.           |

---

### 💸 Transaction Management

| ID  | Use Case                     | Actors | Description                        |
| --- | ---------------------------- | ------ | ---------------------------------- |
| 01  | Create transaction           | User   | Add a new income or expense entry. |
| 02  | View list transactions       | User   | Display all transactions.          |
| 03  | Remove transaction           | User   | Delete a transaction.              |
| 04  | Edit transaction             | User   | Update transaction details.        |
| 05  | Create recurring transaction | User   | Schedule a transaction to recur.   |

---

### 👥 Group Management

| ID  | Use Case                        | Actors | Description                                      |
| --- | ------------------------------- | ------ | ------------------------------------------------ |
| 01  | Create group                    | User   | Create a group for shared expenses.              |
| 02  | Update group                    | User   | Edit group details like name and goals.          |
| 03  | Request a withdrawal            | User   | Submit a fund withdrawal request.                |
| 04  | Remind raising fund             | User   | Group leader sends reminders to contribute.      |
| 05  | View list transactions in group | User   | View all financial activities in the group.      |
| 06  | Raising funds request           | User   | Request members to contribute to the group fund. |
| 07  | Disband the group               | User   | Admin removes the group entirely.                |
| 08  | Set goal amount                 | User   | Set a financial goal for the group.              |
| 09  | View list members in group      | User   | Display all group participants.                  |
| 10  | Add member by QR                | User   | Join group via QR code.                          |
| 11  | Add member by email             | User   | Invite new member via email.                     |
| 12  | Kick member                     | User   | Remove a member from the group.                  |
| 13  | View statistic group            | User   | View group reports and analytics.                |
| 14  | Leave group                     | User   | Exit from a group.                               |

---

### 📊 Statistic Management

| ID  | Use Case              | Actors | Description                                      |
| --- | --------------------- | ------ | ------------------------------------------------ |
| 01  | Set spending model    | User   | Select a financial model for expense tracking.   |
| 02  | Set spending limit    | User   | Define budget limits to receive spending alerts. |
| 03  | View report statistic | User   | Analyze charts, reports, and trends.             |
| 04  | Set personal goal     | User   | Set personal savings or budget targets.          |

---

### 🧠 Quiz Management

| ID  | Use Case          | Actors | Description                                        |
| --- | ----------------- | ------ | -------------------------------------------------- |
| 01  | Create quiz       | Admin  | Admin creates financial profiling quizzes.         |
| 02  | Update quiz       | Admin  | Modify quiz questions and answers.                 |
| 03  | View list quizzes | Admin  | Review all created quizzes.                        |
| 04  | Delete quiz       | Admin  | Remove a quiz from the system.                     |
| 05  | Apply quiz        | Admin  | Apply quiz for user take.                          |
| 06  | Take quiz         | User   | Answer quiz to receive spending model suggestions. |

---

### 🗂 Category Management

| ID  | Use Case              | Actors | Description                                        |
| --- | --------------------- | ------ | -------------------------------------------------- |
| 01  | Create category       | Admin  | Add a new expense category.                        |
| 02  | Update category       | Admin  | Modify existing category.                          |
| 03  | View list category    | Admin  | Display all available categories.                  |
| 04  | Delete category       | Admin  | Remove a category from the system.                 |
| 05  | Create subcategory    | Admin  | Create a subcategory under one or more categories. |
| 06  | Update subcategory    | Admin  | Edit subcategory info.                             |
| 07  | View list subcategory | Admin  | View all subcategories and their mappings.         |
| 08  | Delete subcategory    | Admin  | Delete and reassign related expenses.              |

---

### 🧾 Spending Model Management

| ID  | Use Case                 | Actors | Description                            |
| --- | ------------------------ | ------ | -------------------------------------- |
| 01  | Create spending model    | Admin  | Define rules for managing spending.    |
| 02  | Update spending model    | Admin  | Adjust categories and recommendations. |
| 03  | View list spending model | Admin  | Display all available models.          |
| 04  | Delete spending model    | Admin  | Remove obsolete models.                |

---

### 🏦 Bank Account Management

| ID  | Use Case                 | Actors | Description                            |
| --- | ------------------------ | ------ | -------------------------------------- |
| 01  | Add bank account         | User   | Securely link a new bank account.      |
| 02  | Edit bank account        | User   | Update bank account information.       |
| 03  | View bank account detail | User   | View current balance and transactions. |
| 04  | Delete bank account      | User   | Unlink a bank account.                 |

---

#### 5 Members:

- [Đăng Phan Gia Đức](https://github.com/giaducdang03) (Leader, Back-end Dev)
- [Dương Tôn Bảo](https://github.com/duongbao0803) (Front-end Dev, Mobile Dev)
- [Nguyễn Thương Huyền](https://github.com/ngthuonghuyenn) (Back-end Dev)
- [Đặng Ngọc Minh Trí](https://github.com/bomismegg) (Mobile Dev)
- [Phạm Nhật Linh](https://github.com/LeoPham20303) (Mobile Dev)

#### Screen-shots

###### User App | MoneyEasy Financial System

![User App](<https://firebasestorage.googleapis.com/v0/b/exe201-9459a.appspot.com/o/EzMoney%2Fz6591936686534_80612e567bccf199115c69e789e9ce79(1).jpg?alt=media&token=bc0bc775-4558-4601-93c4-27dc10d7e8cf>)

###### Web Administrator | MoneyEasy Financial System

![Web Administrator](https://firebasestorage.googleapis.com/v0/b/exe201-9459a.appspot.com/o/EzMoney%2FScreenshot%202025-05-12%20004847.png?alt=media&token=6980203c-c6e7-4579-b92f-4ad364c5bdb2)

... (see more in screenshots)

###### Web Administrator | Banking Demo System

![Banking Demo System](https://firebasestorage.googleapis.com/v0/b/exe201-9459a.appspot.com/o/EzMoney%2FScreenshot%202025-05-12%20005035.png?alt=media&token=9a54904f-b820-44c1-8299-a60fb66af7cf)

... (see more in screenshots)

#### Techstacks:

- Front-end: React Native, NextJS, TailwindCSS, Shadcn/UI, Antd, RTK Query, Framer Motion, ChartJS.
- Back-end: ASP.NET Core 8, MS SQL, SignalR, Redis, QdrantDB.
- Deployment: DigitalOcean (VPS Hosting), Docker, GitHub Actions.
- Other: Google Gemini API, Firebase, GitHub, Jira, Swagger, Yarn.

#### Deployment:

- Mobile: https://drive.google.com/drive/folders/17IxEvarY0fXSZOz3JWJUKUUX-_XxTmfu
- Front-end: https://easymoney.anttravel.online/moneyez-web
- Front-end: https://easymoney.anttravel.online/moneyez-bank-web (Banking Demo System)
- Back-end: https://easymoney.anttravel.online/swagger/index.html
- Back-end: https://easymoney.anttravel.online/moneyez-bank/api (Banking Demo System)

#### References:

- Mobile: https://github.com/MoneyEZ-FUHCM/moneyez-mobile
- Front-end: https://github.com/MoneyEZ-FUHCM/moneyez-web
- Front-end: https://github.com/MoneyEZ-FUHCM/moneyez-bank-web (Banking Demo System)
- Back-end: https://github.com/MoneyEZ-FUHCM/moneyez-api
- Back-end: https://github.com/MoneyEZ-FUHCM/moneyez-bank (Banking Demo System)
- AI Service: https://github.com/MoneyEZ-FUHCM/moneyez-ai-service
- Figma: [MoneyEasy UI](https://www.figma.com/design/DYCEzZZarDpHxpyDQs0EMu/EzMoney-Mobile?node-id=0-1&t=h84bZhhr8b6RdEe7-1)
- Documents: [MoneyEasy Docs](https://drive.google.com/drive/folders/1uaXbvJhQUk3dVXyvYChcydWGYnakpkxd?usp=sharing)

##### Contact me via: tonbao0803@gmail.com

##### Copyright &#169; 2025 MoneyEasy
