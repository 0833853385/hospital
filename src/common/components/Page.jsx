const Page = ({ children }) => {
  return (
    <div
      style={{
        width: '100%',
        justifyContent: 'center',
        padding: '16px',
        alignItems: 'center',
        background: '#FFF',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default Page;
