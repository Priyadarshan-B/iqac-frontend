import React from 'react'
import './Dashboard.css'
import InputBox from '../../components/InputBox/inputbox'
import Button from '../../components/Button/Button'
import Card from '../../components/card/Card'

function Dashboard() {
    return (
        <div className='dashboard-container'>
            Dashboard...
            <InputBox placeholder='Enter your name...' />
            <Button label='Button' />
            <Card
                title="Sample Card"
                image="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
                description="This is a sample card description.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultricies urna id tincidunt ultricies. Fusce vehicula elit vel nunc varius scelerisque. Nullam eget magna id nisi pharetra ultricies. Donec nec orci non enim convallis porta vitae id ex. Nullam sollicitudin, justo id pretium condimentum, libero lorem ultricies ex, sit amet efficitur sapien metus sit amet odio. Phasellus sit amet lobortis nibh. Vivamus tempor auctor orci, sit amet vestibulum mauris. Ut consequat sapien a nisl fermentum, eget mattis justo volutpat. Aenean nec nisl eu arcu gravida tempus nec id purus. Duis consectetur tortor sit amet lacus lobortis, sit amet consectetur nunc sodales. Nulla eleifend nulla id metus consequat, nec ultricies lorem sollicitudin. Quisque finibus metus nec tortor hendrerit, nec aliquet purus convallis.
                "
            />
            <InputBox placeholder='Enter your name...' />
            <Button label='Button' />
            <Card
                title="Sample Card"
                image="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
                description="This is a sample card description.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultricies urna id tincidunt ultricies. Fusce vehicula elit vel nunc varius scelerisque. Nullam eget magna id nisi pharetra ultricies. Donec nec orci non enim convallis porta vitae id ex. Nullam sollicitudin, justo id pretium condimentum, libero lorem ultricies ex, sit amet efficitur sapien metus sit amet odio. Phasellus sit amet lobortis nibh. Vivamus tempor auctor orci, sit amet vestibulum mauris. Ut consequat sapien a nisl fermentum, eget mattis justo volutpat. Aenean nec nisl eu arcu gravida tempus nec id purus. Duis consectetur tortor sit amet lacus lobortis, sit amet consectetur nunc sodales. Nulla eleifend nulla id metus consequat, nec ultricies lorem sollicitudin. Quisque finibus metus nec tortor hendrerit, nec aliquet purus convallis.
                "
            />
            <InputBox placeholder='Enter your name...' />
            <Button label='Button' />
            <Card
                title="Sample Card"
                image="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
                description="This is a sample card description.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultricies urna id tincidunt ultricies. Fusce vehicula elit vel nunc varius scelerisque. Nullam eget magna id nisi pharetra ultricies. Donec nec orci non enim convallis porta vitae id ex. Nullam sollicitudin, justo id pretium condimentum, libero lorem ultricies ex, sit amet efficitur sapien metus sit amet odio. Phasellus sit amet lobortis nibh. Vivamus tempor auctor orci, sit amet vestibulum mauris. Ut consequat sapien a nisl fermentum, eget mattis justo volutpat. Aenean nec nisl eu arcu gravida tempus nec id purus. Duis consectetur tortor sit amet lacus lobortis, sit amet consectetur nunc sodales. Nulla eleifend nulla id metus consequat, nec ultricies lorem sollicitudin. Quisque finibus metus nec tortor hendrerit, nec aliquet purus convallis.
                "
            />
        </div>
    )
}

export default Dashboard
