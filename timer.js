const pomodoroTimer = document.querySelector('#pomodoroTimer');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');

let type = 'Work';

let atividadeRelogio = false;

let sessaoDeTrabalho = 1500;
let restoDaSessao = 1500;
let sessaoDeDescanso = 300;
let tempoGastoNaSessao = 0;
let tarefaAtual = document.querySelector('#pomodoro-task');
let updSessaoTrabalho;
let updSessaoDescanso;
let duracaoTrabalhoInput = document.querySelector('#input-work-duration');
let duracaoDescansoInput = document.querySelector('#input-break-duration');
let relogioParado = true; 

const progressBar = new ProgressBar.Circle("#pomodoroTimer", {
    strokeWidth: 7,
    text: {
      value: "25:00"
    },
    trailColor: "#f4f4f4",
  });

duracaoTrabalhoInput.value = '25';
duracaoDescansoInput.value = '5';

startButton.addEventListener('click',() => {
    toggleClock();
})


stopButton.addEventListener('click',() => {
    toggleClock(true);
})

duracaoTrabalhoInput.addEventListener('input',()=>{
    updSessaoTrabalho = minuteToSeconds(duracaoTrabalhoInput.value)
})

duracaoDescansoInput.addEventListener('input',() => {
    updSessaoDescanso = minuteToSeconds(duracaoDescansoInput,value)
})

const minuteToSeconds = mins => {
    return mins * 60
}

const updtTimers = () => {
    if ( type === 'Work'){
        restoDaSessao = updSessaoTrabalho 
        ? updSessaoTrabalho
        : sessaoDeTrabalho
        sessaoDeTrabalho = restoDaSessao
    } else {
        restoDaSessao = updSessaoDescanso
        ? updSessaoDescanso
        : sessaoDeDescanso
        sessaoDeDescanso = restoDaSessao
    }
}

const toggleClock = (reset) => {
   selecPlayPauseIcon(reset);
    if (reset){
        stopClock();
    }else{
        console.log(relogioParado);
        if (relogioParado){
            updtTimers();
            relogioParado = false;
        }

        if(atividadeRelogio === true) {
            clearInterval(clockTimer);
            atividadeRelogio = false;
        }else {
            clockTimer = setInterval(() => {
                stepDown();
                exibirRestanteDaSessao();
                progressBar.set(calculateSessionProgress());
            }, 1000);
            atividadeRelogio = true;
        }
        showStopIcon();
    }
}

const exibirRestanteDaSessao = () => {
    const segundosRestantes = restoDaSessao;
    let resultado = '';
    const segundos = segundosRestantes % 60;
    const minutos = parseInt(segundosRestantes/60) % 60;
    let horas = parseInt(segundosRestantes / 3600);

    function addZeroEsquerda(time){
        return time < 10 ? `0${time}`: time
    }
    if (horas > 0) resultado += `${horas}:`
    resultado +=
    `${addZeroEsquerda(minutos)}:${addZeroEsquerda(segundos)}`
     progressBar.text.innerText = resultado.toString();
}


const stopClock = () => {
    updtTimers();
    displaySessionLog(type);
    clearInterval(clockTimer);
    relogioParado = true;
    atividadeRelogio = false;
    restoDaSessao = sessaoDeTrabalho;
    exibirRestanteDaSessao();
    type = 'Work';
    tempoGastoNaSessao = 0;
};

const stepDown = () => {
    if (restoDaSessao > 0){
        restoDaSessao--;
        tempoGastoNaSessao++;
    } else if(restoDaSessao === 0){
        tempoGastoNaSessao = 0;
        if(type === 'Work') {
            restoDaSessao = sessaoDeDescanso;
            displaySessionLog('Work');
            type = 'Break';
            updtTimers();
            tarefaAtual.value = 'Break';
            tarefaAtual.disabled = true;
        } else {
            restoDaSessao = sessaoDeTrabalho;
            type = 'Work';
            updtTimers();
            if(tarefaAtual.value === 'Break'){
            displaySessionLog('Break');
            }
        }
    }
    exibirRestanteDaSessao();
}


const displaySessionLog = (type) => {
    const listaSessao = document.querySelector('#pomodoro-sessions');
    const li = document.createElement('li');
    
    if (type === 'Work'){
        tagSessao = tarefaAtual.value
        ? tarefaAtual.value: 'Work'
        tagSessaoTrabalho = tagSessao
    } else {
        tagSessao = '🍃 Break'
    }

    let tempoDecorrido = parseInt(tempoGastoNaSessao / 60)

    tempoDecorrido = tempoDecorrido > 0 ? tempoDecorrido : '< 1';

    const texto = document.createTextNode(`${tagSessao} : ${tempoDecorrido} min`)
    li.appendChild(texto);
    listaSessao.appendChild(li);


}

const selecPlayPauseIcon = (reset) => {
    const playIcon = document.querySelector('#play-icon');
    const pauseIcon = document.querySelector('#pause-icon');
    if (reset) {
        if(playIcon.classList.contains('hidden')) {
            playIcon.classList.remove('hidden')
        }
        if (!pauseIcon.classList.contains('hidden')){
            pauseIcon.classList.add('hidden')
        } else {
            playIcon.classList.toggle('hidden')
            pauseIcon.classList.toggle('hidden')
        }
    }
}

const showStopIcon = () =>{
    const stopButton = document.querySelector('#stop')
    stopButton.classList.remove('hidden');
}

const calculateSessionProgress = () => {
    const duracaoSessao = 
    type === 'Work' ? sessaoDeTrabalho : sessaoDeDescanso
    return (tempoGastoNaSessao/duracaoSessao) * 10
}