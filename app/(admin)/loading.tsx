// app/loading.tsx
export default function Loading() {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <span>Đang tải...</span>
        {/* Hoặc dùng spinner của Ant Design/Material UI */}
      </div>
    );
  }