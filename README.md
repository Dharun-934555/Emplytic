# EMPlytic - AI-Powered Employee Performance Analytics

**EMPlytic** is a modern, premium HR performance analytics SaaS application that uses Machine Learning classification models to analyze employee workforce data and identify staff into three distinct performance groups:

- 🟢 **High Performance**
- 🟡 **Medium Performance**
- 🔴 **Low Performance**

---

## 🎨 Key Features & Architecture

- **Premium Modern HR SaaS UI**: Soft glassmorphic cards, warm off-white palette (`#fbfafd`), charcoal contrast elements, subtle shadows, and gold/amber highlights.
- **Dynamic Scikit-Learn ML Pipeline**: Trains and compares **Logistic Regression**, **Decision Tree**, and **Random Forest** algorithms dynamically without hardcoding. Calculates real accuracy, precision, recall, F1-scores, 3x3 confusion matrix, and feature importance rankings.
- **Real-Time ML Prediction Engine**: Input form with 18 key employee indicators (Age, Department, Role, Tenure, Monthly Income, Job Level, Satisfaction Ratings, Attendance Rate, Overtime, Engagement, etc.) with quick-fill presets and confidence percentage output.
- **Dataset Upload & Retraining**: Upload custom CSV datasets, preview dataset metadata (rows, columns, missing values, duplicates, feature types), and trigger automatic ML pipeline re-training.
- **Interactive Multi-Chart Analytics**: Interactive cross-tabulation charts filtering performance across departments, roles, experience bands, training hours, and compensation tiers.
- **HR Predictive Insights**: Pattern recognition and statistical insights with explicit correlation vs. causation disclaimers.

---

## 🛠️ Technology Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS**
- **Recharts** (Interactive visual graphs)
- **Lucide React** icons

### Backend
- **Python 3.13**
- **FastAPI**
- **SQLAlchemy** (PostgreSQL / SQLite fallback)
- **Pydantic v2**
- **JWT Authentication**

### Machine Learning
- **Scikit-learn** (`ColumnTransformer`, `OneHotEncoder`, `StandardScaler`, `RandomForestClassifier`, `LogisticRegression`, `DecisionTreeClassifier`)
- **Pandas** & **NumPy**
- **Joblib** (Model serialization saved in `backend/models/trained_model.joblib`)

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
python seed.py
python main.py
```
Backend API will start at: `http://localhost:8000` (Swagger docs at `/docs`)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend Web Application will start at: `http://localhost:5173`

---

## 📊 Default Credentials
- **Admin**: `admin@emplytic.ai` / `admin123`
- **HR Manager**: `hr@emplytic.ai` / `hr123`
