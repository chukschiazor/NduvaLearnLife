import DiscussionThread from '../DiscussionThread'

export default function DiscussionThreadExample() {
  return (
    <div className="max-w-2xl">
      <DiscussionThread
        id="1"
        author="Alex Rivera"
        authorInitials="AR"
        title="How do you stay motivated while learning budgeting?"
        preview="I've been trying to learn about budgeting but sometimes find it challenging to stay consistent. What strategies do you use?"
        replies={12}
        likes={24}
        timeAgo="2 hours ago"
      />
    </div>
  )
}
