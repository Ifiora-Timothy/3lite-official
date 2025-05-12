
import ProfileSummary from './ProfileSummary';


const ProfilePanel= () => {


  return (
    <div 
      className={`glass-effect h-full flex flex-col w-full `}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <h2 className="text-xl font-bold">Profile</h2>
      
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
      <ProfileSummary/>
        
        {/* Recent Activity */}
        <div className="glass-effect rounded-lg p-4">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <div className="text-sm opacity-70 text-center py-4">
            No recent activity
          </div>
        </div>
      </div>
    </div>
  );
};



export default ProfilePanel;