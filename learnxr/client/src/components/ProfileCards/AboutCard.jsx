export default function AboutCard({ about = "", isEditing = false, onSave, isOwnProfile }) {
    return (
        <div className="bg-[#3b348b] p-6 rounded-xl">
            <h3 className="text-xl mb-4 font-semibold">About</h3>
            <p className="text-gray-300">
                {about || (isOwnProfile ? "Add a bio to tell people about yourself..." : "No bio yet.")}
            </p>
        </div>
    );
}
  