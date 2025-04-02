export const getUserAvatar = (user:any) => {
  if (user.image) {
    return <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />;
  } else {
    return (
      <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-medium">
        {user.name.charAt(0).toUpperCase()}
      </div>
    );
  }
};