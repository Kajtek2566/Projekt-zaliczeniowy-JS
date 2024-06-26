document.addEventListener('DOMContentLoaded', () => {
    const keys = document.querySelectorAll('.key');
    const audioElements = document.querySelectorAll('audio');
    const playAllButton = document.getElementById('play-all');
    const metronomeButton = document.getElementById('metronome');
    const addChannelButton = document.getElementById('add-channel');
    const loopCheckbox = document.getElementById('loop');
    const metronomeSound = document.getElementById('metronome-sound');
    const bpmInput = document.getElementById('bpm');
    const channelsDiv = document.getElementById('channels');

    let channels = [[], [], [], []];
    let isRecording = false;
    let recordingChannel = null;
    let metronomeInterval = null;
    let nextChannelId = 5;

    keys.forEach(key => {
        key.addEventListener('click', () => playSound(key.dataset.key));
    });

    document.addEventListener('keydown', (e) => {
        const keyElement = document.querySelector(`.key[data-key="${e.keyCode}"]`);
        if (keyElement) playSound(e.keyCode);
    });

    addChannelButton.addEventListener('click', () => {
        const newIndex = channels.length;
        channels.push([]);
        const newChannelDiv = document.createElement('div');
        newChannelDiv.classList.add('channel');
        newChannelDiv.innerHTML = `
            <label><input type="checkbox" id="channel-${nextChannelId}" checked> Kanał ${nextChannelId}</label>
            <button id="record-channel-${newIndex}" class="record">Nagraj Kanał ${nextChannelId}</button>
            <button id="play-channel-${newIndex}" class="play">Odtwórz Kanał ${nextChannelId}</button>
        `;
        channelsDiv.appendChild(newChannelDiv);
        console.log(`Dodano nowy kanał: Kanał ${nextChannelId}`);

        const recordButton = document.getElementById(`record-channel-${newIndex}`);
        const playButton = document.getElementById(`play-channel-${newIndex}`);

        recordButton.addEventListener('click', () => {
            recordingChannel = newIndex;
            channels[newIndex] = [];
            isRecording = true;
            console.log(`Nagrywanie rozpoczęte na kanale ${nextChannelId}`);
        });

        playButton.addEventListener('click', () => {
            console.log(`Odtwarzanie kanału ${nextChannelId} rozpoczęte`);
            playChannel(newIndex);
        });

        nextChannelId++;
    });

    loopCheckbox.addEventListener('change', () => {
        if (loopCheckbox.checked) {
            console.log('Zapętlenie włączone');
        } else {
            console.log('Zapętlenie wyłączone');
        }
    });

    metronomeButton.addEventListener('click', () => {
        if (metronomeInterval) {
            clearInterval(metronomeInterval);
            metronomeInterval = null;
            console.log('Metronom wyłączony');
        } else {
            const bpm = parseInt(bpmInput.value);
            const interval = (60 / bpm) * 1000;
            metronomeInterval = setInterval(() => {
                metronomeSound.currentTime = 0;
                metronomeSound.play();
            }, interval);
            console.log(`Metronom włączony na ${bpm} uderzeń na minutę`);
        }
    });

    playAllButton.addEventListener('click', playAllChannels);

    channelsDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('record')) {
            const channelIndex = Array.from(channelsDiv.querySelectorAll('.record')).indexOf(e.target);
            recordingChannel = channelIndex;
            channels[channelIndex] = [];
            isRecording = true;
            console.log(`Nagrywanie rozpoczęte na kanale ${channelIndex + 1}`);
        } else if (e.target.classList.contains('play')) {
            const channelIndex = Array.from(channelsDiv.querySelectorAll('.play')).indexOf(e.target);
            console.log(`Odtwarzanie kanału ${channelIndex + 1} rozpoczęte`);
            playChannel(channelIndex);
        }
    });

    function playSound(keyCode) {
        const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
        const key = document.querySelector(`.key[data-key="${keyCode}"]`);

        if (!audio) return;

        audio.currentTime = 0;
        audio.play();
        key.classList.add('playing');

        setTimeout(() => key.classList.remove('playing'), 200);

        if (isRecording && recordingChannel !== null) {
            const time = Date.now();
            channels[recordingChannel].push({ keyCode, time });
        }
    }

    function playChannel(channelIndex) {
        if (channels[channelIndex].length === 0) return;

        const startTime = channels[channelIndex][0].time;
        channels[channelIndex].forEach(note => {
            const delay = note.time - startTime;
            setTimeout(() => {
                playSound(note.keyCode);
            }, delay);
        });

        if (loopCheckbox.checked) {
            setTimeout(() => {
                console.log(`Odtwarzanie kanału ${channelIndex + 1} zatrzymane`);
                playChannel(channelIndex);
            }, channels[channelIndex][channels[channelIndex].length - 1].time - startTime);
        } else {
            setTimeout(() => {
                console.log(`Odtwarzanie kanału ${channelIndex + 1} zatrzymane`);
            }, channels[channelIndex][channels[channelIndex].length - 1].time - startTime);
        }
    }

    function playAllChannels() {
        const activeChannels = Array.from(document.querySelectorAll('#channels input:checked'))
            .map(checkbox => parseInt(checkbox.id.replace('channel-', '')) - 1);

        activeChannels.forEach(index => {
            playChannel(index);
        });

        if (loopCheckbox.checked) {
            const longestChannel = activeChannels.reduce((max, index) => {
                const length = channels[index][channels[index].length - 1].time - channels[index][0].time;
                return length > max ? length : max;
            }, 0);

            setTimeout(playAllChannels, longestChannel);
        }
    }
});
               
