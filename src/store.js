import { observable, action } from 'mobx';
import client from './api/zafClient';
import zafClient from './api/zafClient';

export default class Store {
  @observable
  requester = {};
  @observable
  notes = [];
  @observable
  currentUserName = '';

  @action
  async getNotes() {
    var settings = {
      url: `https://ambassador-stg.doodle-test.com/svc-notes/notes/${this.requester.id}`,
      headers: {"ATAuth": "{{setting.token}}"},
      secure: true,
      type: 'GET',
      dataType: 'json'
    };
    client.request(settings).then((data) => this.notes = data);
  }

  @action
  async createNote(text) {
    const newNote = {
      referenceId: String(this.requester.id),
      author: this.currentUserName,
      text: text
    };
    const settings = {
      url: 'https://ambassador-stg.doodle-test.com/svc-notes/notes',
      headers: {"ATAuth": "{{setting.token}}"},
      secure: true,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newNote)
    };
    var client = ZAFClient.init();
    client.request(settings).then((response) => this.notes.push(response));
  }

  @action
  async getRequester() {
    const res = await zafClient.get('ticket.requester');
    this.requester = res['ticket.requester'];
  }

  @action
  async getLoggedInUserName() {
    const response = await zafClient.request({
      url: '/api/v2/users/me.json',
      type:'GET',
      dataType: 'json'
    })
    this.currentUserName = response.user.name;
  }

  @action
  async fetchData() {
    await this.getLoggedInUserName();
    await this.getRequester();
    await this.getNotes();
  }

}