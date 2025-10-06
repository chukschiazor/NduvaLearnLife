import VideoPlayer from '../VideoPlayer'
import creativityImg from '@assets/generated_images/Creativity_module_thumbnail_fe82ef99.png'

export default function VideoPlayerExample() {
  return (
    <div className="max-w-3xl">
      <VideoPlayer
        title="Introduction to Creative Thinking"
        thumbnail={creativityImg}
        duration="12:30"
        progress={75}
        onMarkComplete={() => console.log('Marked complete')}
      />
    </div>
  )
}
