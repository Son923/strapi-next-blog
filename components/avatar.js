import Image from 'next/image'

export default function Avatar({ name, picture }) {
  const API_URL=`http://latteblog.herokuapp.com`
  const final_pic = picture.data.attributes
  const url = final_pic.url ?? final_pic[0].url

  return (
    <div className="flex items-center">
      <div className="w-12 h-12 relative mr-4">
        <Image
          src={`${
            url.startsWith('/') ? API_URL : ''
          }${url}`}
          layout="fill"
          className="rounded-full"
          alt={name}
        />
      </div>
      <div className="text-xl font-bold">{name}</div>
    </div>
  )
}
