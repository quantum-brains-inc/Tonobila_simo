import React, { Component } from 'react'
import Step1edit from './Step1edit'
import Step2edit from './Step2edit'
import Step3edit from './Step3edit'
import firebase from '../../Firebase'
import FileUploader from "react-firebase-file-uploader";
// import './multiStep.css'


export default class Master2 extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentStep: 1,
            key:'',
            title: '',
            description: '',
            carrosserie: '',
            adresse: '',
            telephone: '',
            author: '',
            ville:'',
            prix:'',
            uid: '',
            marque: '',
            prix: '',
            modele: '',
            carburant: '',
            main: '',
            puissance_fiscale: '',
            annee: '',
            couleur_ex: '',
            couleur_in: '',
            type_cha: '',
            kilometrage: '',
            num_port: '',
            filenames: [],
            downloadURLs: [],
            isUploading: false,
            errorText: '',
            progress: 0,
        }
        this.handleChange = this.handleChange.bind(this)
        this._next = this._next.bind(this)
        this._prev = this._prev.bind(this)
    }

    componentDidMount() {
        const ref = firebase.firestore().collection('posts').doc(this.props.match.params.id);
        ref.get().then((doc) => {
            if (doc.exists) {
                const posts = doc.data();
                this.setState({
                    key: doc.id,
                    title: posts.title,
                    description: posts.description,
                    author: posts.author,
                    ville: posts.ville,
                    carrosserie: posts.carrosserie,
                    adresse: posts.adresse,
                    telephone: posts.telephone,
                    marque: posts.marque,
                    prix: posts.prix,
                    modele: posts.modele,
                    carburant: posts.carburant,
                    main: posts.main,
                    puissance_fiscale: posts.puissance_fiscale,
                    annee: posts.annee,
                    couleur_ex: posts.couleur_ex,
                    couleur_in: posts.couleur_in,
                    type_cha: posts.type_cha,
                    kilometrage: posts.kilometrage,
                    num_port: posts.num_port,
                    
                });
            } else {
                
            }
        });
    }

    _next() {
        let currentStep = this.state.currentStep;
        const step1Names = ['marque', 'modele', 'adresse', 'telephone', 'ville', 'annee', 'prix'];
        const step2Names = ['main', 'carburant', 'couleur_ex', 'couleur_in', 'carrosserie', 'kilometrage', 'num_port', 'puissance_fiscale']
        let namesArray;
        switch (currentStep) {
            case 1:
                namesArray = step1Names;
                break;
            case 2:
                namesArray = step2Names;
                break;
        }
        let count = 0;
        for (let i = 0; i < namesArray.length; i++) {
            if (this.state[namesArray[i]] == '' || this.state[namesArray[i]] == undefined) {
                count++
            }
        }
        if (count === 0) {
            currentStep = currentStep >= 2 ? 3 : currentStep + 1
            this.setState({
                currentStep: currentStep,
                errorText: ''
            })
        } else {
            this.setState({ errorText: "veuillez choisir une valeur" })
        }
    }

    _prev() {
        let currentStep = this.state.currentStep
        currentStep = currentStep <= 1 ? 1 : currentStep - 1
        this.setState({
            currentStep: currentStep
        })
    }
    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    metaData = () => {
        let user = firebase.auth().currentUser;
        let name = user.displayName;
        let uid = user.uid;
        this.setState({
            author: { name },
            uid: { uid }
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()

        const { title, description, author, telephone, adresse,ville, main, carrosserie, uid, marque, downloadURLs, prix, modele, carburant, annee, couleur_ex, couleur_in, type_cha, kilometrage, num_port, puissance_fiscale } = this.state;
        const updateRef = firebase.firestore().collection('posts').doc(this.state.key);
        if (downloadURLs.length !== 0 && description != '') {

            updateRef.set({
                title,
                description,
                marque,
                main,
                downloadURLs,
                author,
                telephone,
                ville,
                adresse,
                carrosserie,
                puissance_fiscale,
                uid,
                prix,
                modele,
                carburant,
                annee,
                couleur_ex,
                couleur_in,
                type_cha,
                kilometrage,
                num_port
            }).then((docRef) => {
                this.setState({
                    title: '',
                    adresse: '',
                    author: '',
                    main: '',
                    ville,
                    telephone: '',
                    uid: '',
                    description: '',
                    puissance_fiscale: '',
                    marque: '',
                    carrosserie,
                    prix: '',
                    modele: '',
                    carburant: '',
                    annee: '',
                    couleur_ex: '',
                    couleur_in: '',
                    type_cha: '',
                    kilometrage: '',
                    num_port: '',
                    errorText: '',
                    downloadURLs: []
                });
                this.props.history.push("/show/" + this.props.match.params.id)
            })
        } else {
            this.setState({ errorText: "Please, upload your car's images and fill the description" })
        }
    }
    handleChangeUsername = event =>
        this.setState({ username: event.target.value });
    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
    };
    handleUploadSuccess = async filename => {
        const downloadURL = await firebase
            .storage()
            .ref("images")
            .child(filename)
            .getDownloadURL();

        this.setState(oldState => ({
            filenames: [...oldState.filenames, filename],
            downloadURLs: [...oldState.downloadURLs, downloadURL],
            uploadProgress: 100,
            isUploading: false
        }));
    };
    get previousButton() {
        let currentStep = this.state.currentStep;
        if (currentStep !== 1) {
            return <button type="button" className="prevBtn" onClick={this._prev}>Previous</button>
        }
        return null;
    }
    get nextButton() {
        let currentStep = this.state.currentStep;
        if (currentStep < 3) {
            return <button type="button" onClick={this._next}>Next</button>
        }
        return null;
    }
    render() {
        let progressstepClasses = ['steps_progress'];
        if(this.state.currentStep === 2){
            progressstepClasses = ['steps_progress','steps_progress2'];
        }
        if(this.state.currentStep === 3){
            progressstepClasses = ['steps_progress','steps_progress2','steps_progress3'];
        }
        return (
            <React.Fragment>
            <div className='add-post'>
                <div className='addEditPostContainer'>
                    <div className={progressstepClasses.join(' ')}>
                        <h1 className="addEditPostTitle">Modifier ce post</h1>
                        <div>
                            <div>1</div>
                            <div>2</div>
                            <div>3</div>
                        </div>
                    </div>
                    <form className="addEditPostForm" onSubmit={this.handleSubmit}>
                        <Step1edit
                            currentStep={this.state.currentStep}
                            handleChange={this.handleChange}
                            marque={this.state.marque}
                            modele={this.state.modele}
                            adresse={this.state.adresse}
                            ville={this.state.ville}
                            annee={this.state.annee}
                            prix={this.state.prix}
                            telephone={this.state.telephone}
                        />
                        <Step2edit
                            currentStep={this.state.currentStep}
                            handleChange={this.handleChange}
                            main={this.state.main}
                            carburant={this.state.carburant}
                            carrosserie={this.state.carrosserie}
                            couleur_ex={this.state.couleur_ex}
                            couleur_in={this.state.couleur_in}
                            kilometrage={this.state.kilometrage}
                            num_port={this.state.num_port}
                            puissance_fiscale={this.state.puissance_fiscale}
                        />
                        <Step3edit
                            currentStep={this.state.currentStep}
                            handleChange={this.handleChange}
                            description={this.state.description}
                        />
                        {this.state.currentStep == 3 ?
                        <div className="uploadImagesArea">
                            <form>
                                <FileUploader
                                    accept="image/*"
                                    name="image"
                                    randomizeFilename
                                    storageRef={firebase.storage().ref("images")}
                                    onUploadStart={this.handleUploadStart}
                                    onUploadError={this.handleUploadError}
                                    onUploadSuccess={this.handleUploadSuccess}
                                    onProgress={this.handleProgress}
                                    multiple
                                />
                            </form>
                                {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                                {this.state.avatarURL && <img src={this.state.avatarURL} />}
                                <div className="uploadedimages">{this.state.downloadURLs.map((downloadURL, i) =><img style={{width:'80px',marginRight:'5px'}} key={i} src={downloadURL} />)}</div>
                        </div>
                        : null
                            }
                        <div className="prevNextBtnsContainer">
                            <p>{this.state.errorText}</p>
                            <div>
                                {this.previousButton}
                                {this.nextButton}
                                {this.state.currentStep == 3 ? <button type="submit" onClick={this.metaData}>Post</button> : null}
                            </div>
                            
                        </div>
                    </form>
                </div>
            </div>
            </React.Fragment>
        )
    }
}
