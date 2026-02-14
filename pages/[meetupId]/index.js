import { MongoClient, ObjectId } from "mongodb";

import { Fragment } from "react";

import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
    return (
        <MeetupDetail
            // image='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg'
            // title='A First Meetup'
            // address='Some Street 5, Some City'
            // description='This is a First Meetup'
            image={props.meetupData.image}
            title={props.meetupData.title}
            address={props.meetupData.address}
            description={props.meetupData.description}
        />        
    );
}

export async function getStaticPaths() {
    const client = await MongoClient.connect(
        'mongodb+srv://daddyfinger:testing123@reactnextjsmeetup.brhqdmg.mongodb.net/?appName=ReactNextJSMeetup'
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

    client.close();

    return {
        // fallback: false,
        fallback: 'blocking',
        paths: meetups.map(meetup => ({
            params: { meetupId: meetup._id.toString() },
        })),        
        // [
        //     {
        //         params: {
        //         meetupId: 'm1',
        //         },
        //     },
        //     {
        //         params: {
        //         meetupId: 'm2',
        //         },
        //     },
        // ]
    };
}

export async function getStaticProps(context) {

    const meetupId = context.params.meetupId;
    
    const client = await MongoClient.connect(
        'mongodb+srv://daddyfinger:testing123@reactnextjsmeetup.brhqdmg.mongodb.net/?appName=ReactNextJSMeetup'
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const selectedMeetup = await meetupsCollection.findOne({
        _id: new ObjectId(meetupId),
    });

    console.log(selectedMeetup);

    client.close();

    // console.log(meetupId);

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description,
            },            
            // {
            //     image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
            //     id: meetupId,
            //     title: 'A First Meetup',
            //     address: 'Some Street 5, Some City',
            //     description: 'This is a First Meetup',
            // }
        },
    };
}

export default MeetupDetails;